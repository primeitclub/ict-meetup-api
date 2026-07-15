import { DataSource, EntityManager, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Gallery, GalleryImageItem } from '../entities/gallery.entity';
import { CreateGalleryDto, BulkUpdateGalleryDto } from '../validators/gallery.validator';
import { FlagshipEventVersion } from '../../flagship-event/entities/flagship-event.entity';
import fs from 'fs';
import path from 'path';
import cloudinary from '../../../shared/config/cloudinary.config';

const MIN_IMAGES = 1;
const MAX_IMAGES = 7;

interface UploadedImage {
  localPath: string;
  localUrl: string;
  cloudUrl: string;
  publicId: string;
}

export class GalleryService {
  private galleryRepository: Repository<Gallery>;
  private versionRepository: Repository<FlagshipEventVersion>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.galleryRepository = dataSource.getRepository(Gallery);
    this.versionRepository = dataSource.getRepository(FlagshipEventVersion);
  }

  private async validateVersion(versionId: string): Promise<FlagshipEventVersion> {
    const version = await this.versionRepository.findOne({ where: { id: versionId } });
    if (!version) {
      throw new AppError('Flagship event version not found', 404);
    }
    return version;
  }

  private validateImageCount(count: number): void {
    if (count < MIN_IMAGES) {
      throw new AppError(`Please upload at least ${MIN_IMAGES} image to the gallery.`, 400);
    }
    if (count > MAX_IMAGES) {
      throw new AppError(`A maximum of ${MAX_IMAGES} images can be uploaded to the gallery.`, 400);
    }
  }

  private async getByVersionOrNull(versionId: string): Promise<Gallery | null> {
    return await this.galleryRepository.findOne({
      where: { flagshipEventVersionId: versionId },
    });
  }

  /**
   * Add images to a version's gallery. Creates the version's gallery row if it
   * does not exist yet, otherwise appends to the existing `images` array.
   */
  async create(
    data: CreateGalleryDto & { uploadedImages?: UploadedImage[] },
    userId: string
  ): Promise<Gallery> {
    const uploadedImages = data.uploadedImages || [];

    logger.info(`Creating gallery images for version: ${data.flagshipEventVersionId}`, {
      module: 'GalleryService',
      fileCount: uploadedImages.length,
    });

    await this.validateVersion(data.flagshipEventVersionId);

    if (uploadedImages.length === 0) {
      throw new AppError('Please upload at least one image to the gallery.', 400);
    }

    let gallery = await this.getByVersionOrNull(data.flagshipEventVersionId);
    const existingImages = gallery?.images || [];

    const newImages: GalleryImageItem[] = uploadedImages.map((uploadedImage) => ({
      id: uuidv4(),
      imagePath: uploadedImage.localUrl,
      cloudImageUrl: uploadedImage.cloudUrl,
      link: data.link || null,
    }));

    const combined = [...existingImages, ...newImages];
    this.validateImageCount(combined.length);

    if (gallery) {
      gallery.images = combined;
      gallery.modifiedById = userId;
    } else {
      gallery = new Gallery();
      gallery.flagshipEventVersionId = data.flagshipEventVersionId;
      gallery.images = combined;
      gallery.createdById = userId;
    }

    const saved = await this.galleryRepository.save(gallery);

    logger.info(`Gallery now holds ${saved.images.length} images`, {
      module: 'GalleryService',
      versionId: data.flagshipEventVersionId,
    });

    return saved;
  }

  async findAll(query: { version_id?: string; page?: number; limit?: number }): Promise<{ items: Gallery[]; meta: any }> {
    logger.debug('Fetching gallery rows', {
      module: 'GalleryService',
      query,
    });

    const { version_id, page = 1, limit = 10 } = query;
    const where = version_id ? { flagshipEventVersionId: version_id } : {};
    const parsedLimit = Math.min(Number(limit) || 10, 100);
    const skip = (Number(page) - 1) * parsedLimit;

    const [items, total] = await this.galleryRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: parsedLimit,
      relations: ['flagshipEventVersion'],
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async findByVersion(versionId: string): Promise<Gallery> {
    const gallery = await this.galleryRepository.findOne({
      where: { flagshipEventVersionId: versionId },
      relations: ['flagshipEventVersion'],
    });

    if (!gallery) {
      throw new AppError('Gallery not found for this version', 404);
    }

    return gallery;
  }

  /**
   * Replace a version's image list with the submitted one. The `items` array is
   * the desired final state: items with an `id` are kept (link updated), items
   * without an `id` consume the next uploaded file (matched by order), and any
   * existing image absent from `items` is removed (file deleted from storage).
   */
  async bulkUpdate(
    versionId: string,
    data: { items: BulkUpdateGalleryDto; uploadedImages?: UploadedImage[] },
    userId: string
  ): Promise<Gallery> {
    logger.info(`Bulk updating gallery for version: ${versionId}`, {
      module: 'GalleryService',
      submittedCount: data.items.length,
    });

    await this.validateVersion(versionId);

    const uploadedImages: UploadedImage[] = data.uploadedImages || [];

    const gallery = await this.getByVersionOrNull(versionId);
    const existingImages = gallery?.images || [];

    const keptIds = new Set<string>();
    const nextImages: GalleryImageItem[] = [];
    let fileIndex = 0;

    for (const item of data.items) {
      if (item.id) {
        const existing = existingImages.find((img) => img.id === item.id);
        if (existing) {
          if (item.link !== undefined) {
            existing.link = item.link;
          }
          nextImages.push(existing);
          keptIds.add(existing.id);
        }
      } else {
        if (fileIndex < uploadedImages.length) {
          const uploaded = uploadedImages[fileIndex];
          nextImages.push({
            id: uuidv4(),
            imagePath: uploaded.localUrl,
            cloudImageUrl: uploaded.cloudUrl,
            link: item.link || null,
          });
          fileIndex++;
        }
      }
    }

    // Clean up unused new uploads (orphans) - e.g. if more files were sent than referenced
    for (let i = fileIndex; i < uploadedImages.length; i++) {
      const orphan = uploadedImages[i];
      await this.deleteFileFromDisk(versionId, orphan.localUrl, orphan.cloudUrl);
    }

    // Delete files for images that were dropped from the list
    for (const img of existingImages) {
      if (!keptIds.has(img.id)) {
        await this.deleteFileFromDisk(versionId, img.imagePath, img.cloudImageUrl);
      }
    }

    this.validateImageCount(nextImages.length);

    let saved: Gallery;
    if (gallery) {
      gallery.images = nextImages;
      gallery.modifiedById = userId;
      saved = await this.galleryRepository.save(gallery);
    } else {
      const created = new Gallery();
      created.flagshipEventVersionId = versionId;
      created.images = nextImages;
      created.createdById = userId;
      saved = await this.galleryRepository.save(created);
    }

    logger.info(`Bulk update complete. Final count: ${saved.images.length}`, {
      module: 'GalleryService',
      versionId,
    });

    return saved;
  }

  /**
   * Remove a single image from a version's gallery (by the image's array id).
   */
  async deleteImage(versionId: string, imageId: string, userId: string): Promise<Gallery> {
    logger.warn(`Deleting gallery image ${imageId} from version: ${versionId}`, {
      module: 'GalleryService',
    });

    const gallery = await this.findByVersion(versionId);

    const target = gallery.images.find((img) => img.id === imageId);
    if (!target) {
      throw new AppError('Gallery image not found', 404);
    }

    if (gallery.images.length - 1 < MIN_IMAGES) {
      throw new AppError(`Please upload at least ${MIN_IMAGES} image to the gallery.`, 400);
    }

    await this.deleteFileFromDisk(versionId, target.imagePath, target.cloudImageUrl);

    gallery.images = gallery.images.filter((img) => img.id !== imageId);
    gallery.modifiedById = userId;
    const saved = await this.galleryRepository.save(gallery);

    logger.info(`Gallery image deleted: ${imageId}`, {
      module: 'GalleryService',
    });

    return saved;
  }

  async deleteByVersion(versionId: string, userId: string, manager?: EntityManager): Promise<void> {
    logger.warn(`Deleting gallery for version: ${versionId}`, {
      module: 'GalleryService',
    });

    // Skip the existence check when cascading from a version delete (the version
    // is being removed in the same transaction); keep it for the standalone endpoint.
    if (!manager) {
      await this.validateVersion(versionId);
    }

    const repo = manager ? manager.getRepository(Gallery) : this.galleryRepository;

    const gallery = await repo.findOne({ where: { flagshipEventVersionId: versionId } });
    if (!gallery) {
      return;
    }

    for (const img of gallery.images) {
      await this.deleteFileFromDisk(versionId, img.imagePath, img.cloudImageUrl);
    }

    await repo.remove(gallery);

    logger.info(`Deleted gallery (${gallery.images.length} images) for version: ${versionId}`, {
      module: 'GalleryService',
    });
  }

  private async deleteFileFromDisk(versionId: string, imagePath: string, cloudImageUrl?: string): Promise<void> {
    try {
      if (cloudImageUrl) {
        const parts = cloudImageUrl.split('/');
        const filename = parts[parts.length - 1].split('.')[0];
        const version = await this.versionRepository.findOne({ where: { id: versionId } });
        const versionName = version?.version_name || versionId;
        const publicId = `assets/${versionName}/gallery/${filename}`;

        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, {
          module: 'GalleryService',
        });
      }

      let fullPath = imagePath;
      if (imagePath.startsWith('/public')) {
        fullPath = path.join(process.cwd(), imagePath);
      } else if (!path.isAbsolute(imagePath)) {
        fullPath = path.join(process.cwd(), imagePath);
      }

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        logger.info(`File deleted from disk: ${fullPath}`, {
          module: 'GalleryService',
        });
      }
    } catch (error) {
      logger.error(`Failed to delete file: ${imagePath}`, {
        module: 'GalleryService',
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

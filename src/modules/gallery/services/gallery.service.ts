import { DataSource, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { GalleryImage } from '../entities/gallery.entity';
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
  private galleryRepository: Repository<GalleryImage>;
  private versionRepository: Repository<FlagshipEventVersion>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.galleryRepository = dataSource.getRepository(GalleryImage);
    this.versionRepository = dataSource.getRepository(FlagshipEventVersion);
  }

  private async validateVersion(versionId: string): Promise<FlagshipEventVersion> {
    const version = await this.versionRepository.findOne({ where: { id: versionId } });
    if (!version) {
      throw new AppError('Flagship event version not found', 404);
    }
    return version;
  }

  private async getImageCount(versionId: string): Promise<number> {
    return await this.galleryRepository.count({ where: { flagshipEventVersionId: versionId } });
  }

  private async validateImageCount(versionId: string, additionalCount: number = 0): Promise<void> {
    const currentCount = await this.getImageCount(versionId);
    const totalCount = currentCount + additionalCount;

    if (totalCount < MIN_IMAGES) {
      throw new AppError(`Minimum ${MIN_IMAGES} image is required`, 400);
    }

    if (totalCount > MAX_IMAGES) {
      throw new AppError(`Maximum ${MAX_IMAGES} images allowed`, 400);
    }
  }

  async create(
    data: CreateGalleryDto,
    files: Express.Multer.File[],
    userId: string
  ): Promise<GalleryImage[]> {
    logger.info(`Creating gallery images for version: ${data.flagshipEventVersionId}`, {
      module: 'GalleryService',
      fileCount: files?.length || 0,
    });

    await this.validateVersion(data.flagshipEventVersionId);


    const uploadedImages = (files as any)?.uploadedImages || [];

    if (uploadedImages.length === 0) {
      throw new AppError('At least 1 image is required', 400);
    }

    if (uploadedImages.length > MAX_IMAGES) {
      throw new AppError(`Maximum ${MAX_IMAGES} images allowed`, 400);
    }

    await this.validateImageCount(data.flagshipEventVersionId, uploadedImages.length);

    const savedImages: GalleryImage[] = [];

    for (const uploadedImage of uploadedImages) {
      const image = new GalleryImage();
      image.flagshipEventVersionId = data.flagshipEventVersionId;
  
      image.imagePath = uploadedImage.localUrl;
      image.cloudImageUrl = uploadedImage.cloudUrl;
      image.link = data.link || undefined;
      image.createdById = userId;

      const savedImage = await this.galleryRepository.save(image);
      savedImages.push(savedImage);
    }

    logger.info(`Created ${savedImages.length} gallery images`, {
      module: 'GalleryService',
      versionId: data.flagshipEventVersionId,
    });

    return savedImages;
  }

  async findAll(query: { version_id?: string; page?: number; limit?: number }): Promise<{ items: GalleryImage[]; meta: any }> {
    logger.debug('Fetching all gallery images', {
      module: 'GalleryService',
      query,
    });

    const { version_id, page = 1, limit = 10 } = query;
    const where = version_id ? { flagshipEventVersionId: version_id } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.galleryRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip,
      take: Number(limit),
      relations: ['flagshipEventVersion'],
    });

    return {
      items,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findById(id: string): Promise<GalleryImage> {
    const image = await this.galleryRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });

    if (!image) {
      throw new AppError('Gallery image not found', 404);
    }

    return image;
  }

  async bulkUpdate(
    versionId: string,
    data: BulkUpdateGalleryDto,
    files: Express.Multer.File[],
    userId: string
  ): Promise<GalleryImage[]> {
    logger.info(`Bulk updating gallery images for version: ${versionId}`, {
      module: 'GalleryService',
      submittedCount: data.length,
    });

    await this.validateVersion(versionId);

  
    const uploadedImages: UploadedImage[] = (files as any)?.uploadedImages || [];

    const existingImages = await this.galleryRepository.find({
      where: { flagshipEventVersionId: versionId },
    });

    if (data.length !== existingImages.length) {
      throw new AppError(
        `You must submit exactly ${existingImages.length} images`,
        400
      );
    }

    const existingImageIds = new Set(existingImages.map(img => img.id));

    const results: GalleryImage[] = [];
    let fileIndex = 0;

    for (const item of data) {
      if (item.id) {
        const existingImage = existingImages.find(img => img.id === item.id);

        if (!existingImage) {
          continue;
        }

        
        if (item.link !== undefined) {
          existingImage.link = item.link;
          existingImage.modifiedById = userId;
          const updated = await this.galleryRepository.save(existingImage);
          results.push(updated);
        } else {
          results.push(existingImage);
        }

        existingImageIds.delete(item.id);
      } else {
       
        if (fileIndex < uploadedImages.length) {
          const newUploadedImage = uploadedImages[fileIndex];

          const newImage = new GalleryImage();
          newImage.flagshipEventVersionId = versionId;
          newImage.imagePath = newUploadedImage.localUrl;
          newImage.cloudImageUrl = newUploadedImage.cloudUrl;
          newImage.link = item.link || undefined;
          newImage.createdById = userId;

          const saved = await this.galleryRepository.save(newImage);
          results.push(saved);
          fileIndex++;
        }
      }
    }

    
    const currentImageCount = await this.getImageCount(versionId);
    let projectedCount = currentImageCount;

    for (const imageId of existingImageIds) {
      const imageToDelete = existingImages.find(img => img.id === imageId);
      if (imageToDelete) {
        if (projectedCount - 1 < MIN_IMAGES) {
          throw new AppError(`Minimum ${MIN_IMAGES} image is required`, 400);
        }
        await this.deleteFileFromDisk(imageToDelete.imagePath, imageToDelete.cloudImageUrl);
        await this.galleryRepository.remove(imageToDelete);
        projectedCount--;
      }
    }

    logger.info(`Bulk update complete. Final count: ${projectedCount}`, {
      module: 'GalleryService',
      versionId,
    });

    return results;
  }

  async delete(id: string, userId: string): Promise<void> {
    logger.warn(`Deleting gallery image: ${id}`, {
      module: 'GalleryService',
    });

    const image = await this.findById(id);
    const versionId = image.flagshipEventVersionId;

    const finalCount = await this.getImageCount(versionId);
    if (finalCount - 1 < MIN_IMAGES) {
      throw new AppError(`Minimum ${MIN_IMAGES} image is required`, 400);
    }

    await this.deleteFileFromDisk(image.imagePath, image.cloudImageUrl);

    await this.galleryRepository.remove(image);

    logger.info(`Gallery image deleted: ${id}`, {
      module: 'GalleryService',
    });
  }

  async deleteByVersion(versionId: string, userId: string): Promise<void> {
    logger.warn(`Deleting all gallery images for version: ${versionId}`, {
      module: 'GalleryService',
    });

    await this.validateVersion(versionId);

    const images = await this.galleryRepository.find({
      where: { flagshipEventVersionId: versionId },
    });

    for (const image of images) {
      await this.deleteFileFromDisk(image.imagePath, image.cloudImageUrl);
    }

    await this.galleryRepository.remove(images);

    logger.info(`Deleted ${images.length} gallery images for version: ${versionId}`, {
      module: 'GalleryService',
    });
  }

  private async deleteFileFromDisk(imagePath: string, cloudImageUrl?: string): Promise<void> {
    try {
      if (cloudImageUrl) {
        const parts = cloudImageUrl.split('/');
        const versionId = parts[parts.length - 2];
        const filename = parts[parts.length - 1].split('.')[0];
        const publicId = `gallery/${versionId}/${filename}`;
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, {
          module: 'GalleryService',
        });
      }
      
      let fullPath = imagePath;
      if (!path.isAbsolute(imagePath)) {
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


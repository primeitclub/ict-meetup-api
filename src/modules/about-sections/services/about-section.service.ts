import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { AboutSection } from '../entities/about-section.entity';
import { CreateAboutSectionDto, UpdateAboutSectionDto } from '../validators/about-section.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';
import fs from 'fs';
import path from 'path';
import cloudinary from '../../../shared/config/cloudinary.config';

export class AboutSectionService {
  private aboutSectionRepository: Repository<AboutSection>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.aboutSectionRepository = dataSource.getRepository(AboutSection);
  }

  async create(data: CreateAboutSectionDto, userId: string): Promise<AboutSection> {
    logger.info(`Creating new about section`, {
      module: 'AboutSectionService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only create about sections for a flagship event version that is in "draft" status', 400);
    }

    const existing = await this.aboutSectionRepository.findOne({
      where: { versionId: data.versionId },
    });

    if (existing) {
      throw new AppError(
        `About section already exists for this flagship event version`,
        400
      );
    }

    const payload = {
      ...data,
      createdById: userId
    };

    const newAboutSection = this.aboutSectionRepository.create(payload);
    const savedAboutSection = await this.aboutSectionRepository.save(newAboutSection);

    return savedAboutSection;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all about sections', {
      module: 'AboutSectionService',
      query,
    });

    const { versionId, page = 1, limit = 10 } = query;
    const where = versionId ? { versionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.aboutSectionRepository.findAndCount({
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
      }
    };
  }

  async findById(id: string): Promise<AboutSection> {
    const aboutSection = await this.aboutSectionRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
    if (!aboutSection) {
      throw new AppError('About section not found', 404);
    }
    return aboutSection;
  }

  async update(
    id: string,
    data: UpdateAboutSectionDto,
    userId: string
  ): Promise<AboutSection> {
    const aboutSection = await this.findById(id);

    logger.info(`Updating about section: ${id}`, {
      module: 'AboutSectionService',
    });

    const versionId = data.versionId || aboutSection.versionId;
    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update about sections for an archived flagship event version', 400);
    }

    const payload = {
      ...data,
      modifiedById: userId
    };

    Object.assign(aboutSection, payload);
    const updatedAboutSection = await this.aboutSectionRepository.save(aboutSection);

    return updatedAboutSection;
  }

  async delete(id: string, userId: string): Promise<void> {
    const aboutSection = await this.findById(id);

    logger.warn(`Deleting about section: ${id}`, {
      module: 'AboutSectionService',
    });

    await this.aboutSectionRepository.remove(aboutSection);

    return;
  }

  // Delete every about section belonging to a version (cascade on version
  // delete), cleaning up the associated image. Pass `manager` to run inside the
  // version-delete transaction.
  async deleteByVersion(versionId: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(AboutSection) : this.aboutSectionRepository;
    const rows = await repo.find({ where: { versionId } });
    if (!rows.length) return;

    logger.warn(`Deleting about section(s) for version ${versionId}`, {
      module: 'AboutSectionService',
    });

    for (const row of rows) {
      await this.deleteFiles(row.imagePath, row.imageUrl);
    }

    await repo.remove(rows);
  }

  private async deleteFiles(localPath?: string, cloudUrl?: string): Promise<void> {
    try {
      const publicId = this.extractCloudinaryPublicId(cloudUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, {
          module: 'AboutSectionService',
        });
      }

      if (localPath) {
        const fullPath = path.isAbsolute(localPath)
          ? localPath
          : path.join(process.cwd(), localPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted from local disk: ${fullPath}`, {
            module: 'AboutSectionService',
          });
        }
      }
    } catch (error) {
      logger.error(`Failed to delete associated files: ${error instanceof Error ? error.message : String(error)}`, {
        module: 'AboutSectionService',
      });
    }
  }

  // Derive the Cloudinary public id from a stored secure_url, e.g.
  // https://res.cloudinary.com/<cloud>/image/upload/v123/assets/v1/about/x.jpg
  // -> assets/v1/about/x
  private extractCloudinaryPublicId(url?: string): string | null {
    if (!url) return null;
    const marker = '/upload/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    let rest = url.substring(idx + marker.length);
    rest = rest.replace(/^v\d+\//, ''); // strip the version segment
    rest = rest.replace(/\.[^/.]+$/, ''); // strip the file extension
    return rest || null;
  }
}

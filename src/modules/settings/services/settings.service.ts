import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppError } from '../../../shared/utils/error.utils';
import logger from '../../../shared/utils/logger.utils';
import { Settings } from '../entities/settings.entity';
import { CreateSettingsDto, UpdateSettingsDto } from '../validators/settings.validator';
import { FlagshipEventVersion, EventVersionStatus } from '../../flagship-event/entities/flagship-event.entity';
import fs from 'fs';
import path from 'path';
import cloudinary from '../../../shared/config/cloudinary.config';

export class SettingsService {
  private settingsRepository: Repository<Settings>;
  private dataSource: DataSource;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
    this.settingsRepository = dataSource.getRepository(Settings);
  }

  async create(data: CreateSettingsDto & { uploadedImages?: any }, userId: string): Promise<Settings> {
    logger.info(`Creating new settings`, {
      module: 'SettingsService',
    });

    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: data.versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot create settings for an archived flagship event version', 400);
    }

    const existing = await this.settingsRepository.findOne({
      where: { versionId: data.versionId },
    });

    if (existing) {
      throw new AppError(
        `Settings already exist for this flagship event version`,
        400
      );
    }

    const payload = {
      ...data,
      qrCodeUrl: data.uploadedImages?.cloudUrl || data.qrCodeUrl,
      qrCodePath: data.uploadedImages?.publicId || data.qrCodePath,
      qrCodeLocalPath: data.uploadedImages?.localPath || data.qrCodeLocalPath,
      createdById: userId
    };

    const newSettings = this.settingsRepository.create(payload);
    const savedSettings = await this.settingsRepository.save(newSettings);

    return savedSettings;
  }

  async findAll(query: any = {}): Promise<any> {
    logger.debug('Fetching all settings', {
      module: 'SettingsService',
      query,
    });

    const { versionId, page = 1, limit = 10 } = query;
    const where = versionId ? { versionId } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await this.settingsRepository.findAndCount({
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

  async findById(id: string): Promise<Settings> {
    const settings = await this.settingsRepository.findOne({
      where: { id },
      relations: ['flagshipEventVersion'],
    });
    if (!settings) {
      throw new AppError('Settings not found', 404);
    }
    return settings;
  }

  async update(
    id: string,
    data: UpdateSettingsDto & { uploadedImages?: any },
    userId: string
  ): Promise<Settings> {
    const settings = await this.findById(id);

    logger.info(`Updating settings: ${id}`, {
      module: 'SettingsService',
    });

    const versionId = data.versionId || settings.versionId;
    const versionExists = await this.dataSource
      .getRepository(FlagshipEventVersion)
      .findOne({ where: { id: versionId } });

    if (!versionExists) {
      throw new AppError('Flagship event version not found', 404);
    }

    if (versionExists.status === EventVersionStatus.ARCHIVED) {
      throw new AppError('Cannot update settings for an archived flagship event version', 400);
    }

    // Handle QR code lifecycle on update
    const newQrCodePath = data.uploadedImages?.publicId;
    if (newQrCodePath && settings.qrCodePath && newQrCodePath !== settings.qrCodePath) {
      await this.deleteFiles(settings.qrCodeLocalPath, settings.qrCodePath);
    }

    const payload = {
      ...data,
      qrCodeUrl: data.uploadedImages?.cloudUrl || data.qrCodeUrl || settings.qrCodeUrl,
      qrCodePath: data.uploadedImages?.publicId || data.qrCodePath || settings.qrCodePath,
      qrCodeLocalPath: data.uploadedImages?.localPath || data.qrCodeLocalPath || settings.qrCodeLocalPath,
      modifiedById: userId
    };

    Object.assign(settings, payload);
    const updatedSettings = await this.settingsRepository.save(settings);

    return updatedSettings;
  }

  async delete(id: string, userId: string): Promise<void> {
    const settings = await this.findById(id);

    logger.warn(`Deleting settings: ${id}`, {
      module: 'SettingsService',
    });

    if (settings.flagshipEventVersion.status !== EventVersionStatus.DRAFT) {
      throw new AppError('Can only delete settings for a flagship event version that is in "draft" status', 400);
    }

    // Clean up assets before deletion
    await this.deleteFiles(settings.qrCodeLocalPath, settings.qrCodePath);

    await this.settingsRepository.remove(settings);

    return;
  }

  async removeQrCode(id: string, userId: string): Promise<Settings> {
    const settings = await this.findById(id);

    logger.warn(`Removing QR code from settings: ${id}`, {
      module: 'SettingsService',
    });

    await this.deleteFiles(settings.qrCodeLocalPath, settings.qrCodePath);

    settings.qrCodeUrl = null as any;
    settings.qrCodePath = null as any;
    settings.qrCodeLocalPath = null as any;
    settings.modifiedById = userId;

    return await this.settingsRepository.save(settings);
  }

  // Delete the settings row belonging to a version (cascade on version delete),
  // cleaning up the QR code asset. Pass `manager` to run inside the
  // version-delete transaction.
  async deleteByVersion(versionId: string, manager?: EntityManager): Promise<void> {
    const repo = manager ? manager.getRepository(Settings) : this.settingsRepository;
    const rows = await repo.find({ where: { versionId } });
    if (!rows.length) return;

    logger.warn(`Deleting settings for version ${versionId}`, {
      module: 'SettingsService',
    });

    for (const row of rows) {
      await this.deleteFiles(row.qrCodeLocalPath, row.qrCodePath);
    }

    await repo.remove(rows);
  }

  private async deleteFiles(localPath?: string, publicId?: string): Promise<void> {
    try {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, {
          module: 'SettingsService',
        });
      }

      if (localPath) {
        const fullPath = path.isAbsolute(localPath)
          ? localPath
          : path.join(process.cwd(), localPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted from local disk: ${fullPath}`, {
            module: 'SettingsService',
          });
        }
      }
    } catch (error) {
      logger.error(`Failed to delete associated files: ${error instanceof Error ? error.message : String(error)}`, {
        module: 'SettingsService',
      });
    }
  }
}

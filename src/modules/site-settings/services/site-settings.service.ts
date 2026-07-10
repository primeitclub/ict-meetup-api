import { DataSource, Repository } from 'typeorm';
import { SiteSettings } from '../entities/site-settings.entity';
import { UpsertSiteSettingsDto } from '../validators/site-settings.validator';
import logger from '../../../shared/utils/logger.utils';
import cloudinary from '../../../shared/config/cloudinary.config';
import fs from 'fs';
import path from 'path';

export class SiteSettingsService {
  private repository: Repository<SiteSettings>;

  constructor(dataSource: DataSource) {
    this.repository = dataSource.getRepository(SiteSettings);
  }

  async get(): Promise<SiteSettings | null> {
    return this.repository.findOne({ where: {} });
  }

  async upsert(
    data: UpsertSiteSettingsDto & { uploadedImages?: any },
    userId: string
  ): Promise<SiteSettings> {
    const existing = await this.repository.findOne({ where: {} });

    const newQrCodePath = data.uploadedImages?.publicId;

    if (existing) {
      logger.info('Updating site settings', { module: 'SiteSettingsService' });

      // Replacing an existing QR code — delete the old Cloudinary asset first.
      if (newQrCodePath && existing.qrCodePath && newQrCodePath !== existing.qrCodePath) {
        await this.deleteFiles(existing.qrCodeLocalPath, existing.qrCodePath);
      }

      const cleanData = Object.fromEntries(
        Object.entries(data).filter(([key, v]) => v !== undefined && key !== 'uploadedImages')
      );

      Object.assign(existing, cleanData, {
        qrCodeUrl: data.uploadedImages?.cloudUrl || data.qrCodeUrl || existing.qrCodeUrl,
        qrCodePath: data.uploadedImages?.publicId || data.qrCodePath || existing.qrCodePath,
        qrCodeLocalPath: data.uploadedImages?.localPath || data.qrCodeLocalPath || existing.qrCodeLocalPath,
        modifiedById: userId,
      });

      return this.repository.save(existing);
    }

    logger.info('Creating site settings', { module: 'SiteSettingsService' });
    const { uploadedImages, ...rest } = data;
    const created = this.repository.create({
      ...rest,
      qrCodeUrl: uploadedImages?.cloudUrl || data.qrCodeUrl,
      qrCodePath: uploadedImages?.publicId || data.qrCodePath,
      qrCodeLocalPath: uploadedImages?.localPath || data.qrCodeLocalPath,
      createdById: userId,
    });
    return this.repository.save(created);
  }

  async removeQrCode(userId: string): Promise<SiteSettings> {
    const existing = await this.repository.findOne({ where: {} });
    if (!existing) {
      throw new Error('Site settings not found');
    }

    logger.warn('Removing QR code from site settings', { module: 'SiteSettingsService' });

    await this.deleteFiles(existing.qrCodeLocalPath, existing.qrCodePath);

    existing.qrCodeUrl = null as any;
    existing.qrCodePath = null as any;
    existing.qrCodeLocalPath = null as any;
    existing.modifiedById = userId;

    return this.repository.save(existing);
  }

  private async deleteFiles(localPath?: string, publicId?: string): Promise<void> {
    try {
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
        logger.info(`Deleted from Cloudinary: ${publicId}`, { module: 'SiteSettingsService' });
      }

      if (localPath) {
        const fullPath = path.isAbsolute(localPath)
          ? localPath
          : path.join(process.cwd(), localPath);

        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted from local disk: ${fullPath}`, { module: 'SiteSettingsService' });
        }
      }
    } catch (error) {
      logger.error(
        `Failed to delete associated files: ${error instanceof Error ? error.message : String(error)}`,
        { module: 'SiteSettingsService' }
      );
    }
  }
}

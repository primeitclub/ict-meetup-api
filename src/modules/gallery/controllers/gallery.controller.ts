import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { GalleryService } from '../services/gallery.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class GalleryController extends BaseController {
  private service: GalleryService;
  protected moduleName = 'GalleryService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new GalleryService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);

      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "Gallery images created successfully",
        req.body.flagshipEventVersionId,
        AuditLogScope.GALLERY_ITEMS,
        req.ip,
        userId
      );

      return responseHandler(res)(
        'Gallery images created successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll(req.query);
      return responseHandler(res)(
        'Gallery images fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getByVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findByVersion(req.params.version_id);
      return responseHandler(res)(
        'Gallery fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  bulkUpdate = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const versionId = req.params.version_id;
      const result = await this.service.bulkUpdate(
        versionId,
        { items: req.body.data, uploadedImages: req.body.uploadedImages },
        userId
      );

      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        "Gallery images updated successfully",
        versionId,
        AuditLogScope.GALLERY_ITEMS,
        req.ip,
        userId
      );

      return responseHandler(res)(
        'Gallery images updated successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { version_id, image_id } = req.params;
      const result = await this.service.deleteImage(version_id, image_id, userId);

      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Gallery image deleted successfully",
        version_id,
        AuditLogScope.GALLERY_ITEMS,
        req.ip,
        userId
      );

      return responseHandler(res)('Gallery image deleted successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  deleteByVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const versionId = req.params.version_id;
      await this.service.deleteByVersion(versionId, userId);

      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Gallery images for version deleted successfully",
        versionId,
        AuditLogScope.GALLERY_ITEMS,
        req.ip,
        userId
      );

      return responseHandler(res)('Gallery images for version deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

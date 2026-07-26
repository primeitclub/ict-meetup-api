import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { SiteSettingsService } from '../services/site-settings.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class SiteSettingsController extends BaseController {
  private service: SiteSettingsService;
  protected moduleName = 'SiteSettingsService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new SiteSettingsService(dataSource);
  }

  get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.get();
      return responseHandler(res)('Site settings fetched successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.upsert(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        'Site settings updated successfully',
        null,
        AuditLogScope.SITE_SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('Site settings updated successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  removeQrCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.removeQrCode(userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        'Site settings QR code removed successfully',
        null,
        AuditLogScope.SITE_SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('QR code removed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };

  removeProposal = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.removeProposal(userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        'Site settings proposal removed successfully',
        null,
        AuditLogScope.SITE_SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('Proposal removed successfully', result, 200);
    } catch (error) {
      next(error);
    }
  };
}

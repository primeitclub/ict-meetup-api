import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { SettingsService } from '../services/settings.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class SettingsController extends BaseController {
  private service: SettingsService;
  protected moduleName = 'SettingsService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new SettingsService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "Settings created successfully",
        result.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Settings created successfully',
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
        'Settings fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getContacts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { versionId } = req.query as { versionId: string };
      const settings = await this.service.findByVersion(versionId);
      if (!settings) {
        return responseHandler(res)('No settings found for this version', null, 404);
      }
      return responseHandler(res)('Contact settings fetched successfully', {
        contactDepartments: settings.contactDepartments,
      }, 200);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(req.params.id);
      return responseHandler(res)(
        'Settings fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.update(
        req.params.id,
        req.body,
        userId
      );
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        "Settings updated successfully",
        result.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Settings updated successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const settings = await this.service.findById(req.params.id);
      await this.service.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Settings deleted successfully",
        settings.versionId,
        AuditLogScope.SETTINGS,
        req.ip,
        userId
      );
      return responseHandler(res)('Settings deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

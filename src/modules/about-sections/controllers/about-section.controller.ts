import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { AboutSectionService } from '../services/about-section.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class AboutSectionController extends BaseController {
  private service: AboutSectionService;
  protected moduleName = 'AboutSectionService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new AboutSectionService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "About section created successfully",
        result.flagshipEventVersionId,
        AuditLogScope.ABOUT_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'About section created successfully',
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
        'About sections fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findById(req.params.id);
      return responseHandler(res)(
        'About section fetched successfully',
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
        "About section updated successfully",
        result.flagshipEventVersionId,
        AuditLogScope.ABOUT_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'About section updated successfully',
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
      const aboutSection = await this.service.findById(req.params.id);
      await this.service.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "About section deleted successfully",
        aboutSection.flagshipEventVersionId,
        AuditLogScope.ABOUT_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)('About section deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

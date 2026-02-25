import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { FaqService } from '../services/faq.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class FaqController extends BaseController {
  private service: FaqService;
  protected moduleName = 'FaqService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new FaqService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      const result = await this.service.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "Faq created successfully",
        result.id,
        AuditLogScope.FAQ,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Faq created successfully',
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
        'Faqs fetched successfully',
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
        'Faq fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      const result = await this.service.update(
        req.params.id,
        req.body,
        userId
      );
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        "Faq updated successfully",
        result.id,
        AuditLogScope.FAQ,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Faq updated successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      await this.service.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Faq deleted successfully",
        req.params.id,
        AuditLogScope.FAQ,
        req.ip,
        userId
      );
      return responseHandler(res)('Faq deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

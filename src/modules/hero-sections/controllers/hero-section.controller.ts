import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { HeroSectionService } from '../services/hero-section.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { BaseController } from '../../../shared/base/base.controller';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';

export class HeroSectionController extends BaseController {
  private service: HeroSectionService;
  protected moduleName = 'HeroSectionService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new HeroSectionService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        "Hero section created successfully",
        result.flagshipEventVersionId,
        AuditLogScope.HERO_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Hero section created successfully',
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
        'Hero sections fetched successfully',
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
        'Hero section fetched successfully',
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
        "Hero section updated successfully",
        result.flagshipEventVersionId,
        AuditLogScope.HERO_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Hero section updated successfully',
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
      const heroSection = await this.service.findById(req.params.id);
      await this.service.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        "Hero section deleted successfully",
        heroSection.flagshipEventVersionId,
        AuditLogScope.HERO_SECTIONS,
        req.ip,
        userId
      );
      return responseHandler(res)('Hero section deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

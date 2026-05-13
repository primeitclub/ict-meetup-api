import { DataSource } from "typeorm";
import { SponsorService } from "../services/sponsor.service";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../shared/base/base.controller";
import { CategoryService } from "../../category/services/category.service";
import { FlagshipEventVersionService } from "../../flagship-event/services/flagship-event.service";
import { CategoryType } from "../../category/entities/category.entity";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";
import { AuditLogActionType, AuditLogScope, AuditLogType } from "../../../shared/constants/audit-log.constants";

export class SponsorController extends BaseController {
      protected moduleName: string = 'SponsorController';
      private sponsorService: SponsorService;
      private categoryService: CategoryService;
      private flagshipEventVersion: FlagshipEventVersionService;

      constructor(dataSource: DataSource) {
            super(dataSource);
            this.sponsorService = new SponsorService(dataSource);
            this.categoryService = new CategoryService(dataSource);
            this.flagshipEventVersion = new FlagshipEventVersionService(dataSource);
      }

      create = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const versionId = req.body.versionId || req.query.versionId as string || 'system';
                  const result = await this.sponsorService.create(req.body, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Sponsor ${result.id} created successfully`,
                        versionId,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor created successfully', result, 201);
            } catch (error) {
                  next(error);
            }
      }

      update = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const versionId = req.body.versionId || req.query.versionId as string || 'system';
                  const result = await this.sponsorService.update(req.params.id, req.body, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Sponsor ${result.id} updated successfully`,
                        versionId,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor updated successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      delete = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const versionId = req.query.versionId as string || 'system';
                  await this.sponsorService.delete(req.params.id);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Sponsor ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      }

      getById = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.sponsorService.findById(req.params.id);
                  return responseHandler(res)('Sponsor fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.sponsorService.findAll(req.query);
                  return responseHandler(res)('Sponsors fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      createForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const result = await this.categoryService.create(req.body, CategoryType.SPONSOR, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Sponsor category ${result.id} created successfully`,
                        null,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor category created successfully', result, 201);
            } catch (error) {
                  next(error);
            }
      }

      updateForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const result = await this.categoryService.update(
                        req.params.id,
                        CategoryType.SPONSOR,
                        req.body,
                        userId
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Sponsor category ${result.id} updated successfully`,
                        null,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor category updated successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      deleteForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  await this.categoryService.delete(req.params.id, CategoryType.SPONSOR, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Sponsor category ${req.params.id} deleted successfully`,
                        null,
                        AuditLogScope.SPONSORS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Sponsor category deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      }

      getAllForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.categoryService.findAll(req.query, CategoryType.SPONSOR);
                  if (!result.items.length) {
                        return responseHandler(res)('Categories not found', result, 200);
                  }
                  return responseHandler(res)('Sponsor categories fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      getByIdForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.categoryService.findById(req.params.id);
                  return responseHandler(res)('Sponsor category fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }
}

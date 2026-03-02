import { BaseController } from "../../../shared/base/base.controller";
import { DataSource } from "typeorm";
import { SpeakerService } from "../services/speaker.service";
import { removeFile } from "../../../shared/utils/helpers/imageUpload.helper";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";
import { AuditLogActionType, AuditLogScope, AuditLogType } from "../../../shared/constants/audit-log.constants";
import { NextFunction, Request, Response } from "express";
import { CategoryType } from "../../category/entities/category.entity";
import { CategoryService } from "../../category/services/category.service";
import { FlagshipEventVersionService } from "../../flagship-event/services/flagship-event.service";

export class SpeakerController extends BaseController {
      protected moduleName = 'SpeakerService';
      private service: SpeakerService;
      private serviceForCategory: CategoryService;
      private flagshipEventVersion: FlagshipEventVersionService;
      constructor(dataSource: DataSource) {
            super(dataSource);
            this.service = new SpeakerService(dataSource);
            this.serviceForCategory = new CategoryService(dataSource);
            this.flagshipEventVersion = new FlagshipEventVersionService(dataSource);
      }

      create = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const result = await this.service.create(req.body);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Speaker ${result.id} created`,
                        result.versionId,
                        AuditLogScope.SPEAKERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Speaker created successfully',
                        result,
                        201
                  );
            } catch (error) {
                  await removeFile(req.body.imagePath);
                  next(error);
            }
      };

      getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.service.findAll(req.query as any);
                  if (!result.items.length) {
                        return responseHandler(res)('Speakers not found', result, 200);
                  }
                  return responseHandler(res)(
                        'Speakers fetched successfully',
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
                  if (!result) {
                        return responseHandler(res)('Speaker not found', null, 200);
                  }
                  return responseHandler(res)(
                        'Speaker fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      update = async (req: Request, res: Response, next: NextFunction) => {
            let existingSpeaker: any = null;
            try {
                  const userId = (req as any).user?.id || 'system';
                  existingSpeaker = await this.service.findById(req.params.id);

                  const result = await this.service.update(
                        req.params.id,
                        req.body,
                        userId
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Speaker ${result.id} updated successfully`,
                        result.versionId,
                        AuditLogScope.SPEAKERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Speaker updated successfully',
                        null,
                        200
                  );
            } catch (error) {
                  // Only remove the newly uploaded file if it's different from the existing one
                  if (req.body.imagePath && existingSpeaker && req.body.imagePath !== existingSpeaker.imagePath) {
                        await removeFile(req.body.imagePath);
                  }
                  next(error);
            }
      };

      delete = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = (req as any).user?.id || 'system';
                  const versionId = req.query.versionId as string;
                  await this.service.delete(req.params.id, versionId, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Speaker ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.SPEAKERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Speaker deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      };


      createForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  const result = await this.serviceForCategory.create(req.body, CategoryType.SPEAKER, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Category ${result.id} created successfully`,
                        req.body.versionId,
                        AuditLogScope.TEAM_MEMBERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Category created successfully',
                        result,
                        201
                  );
            } catch (error) {
                  next(error);
            }
      };

      updateForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  const result = await this.serviceForCategory.update(
                        req.params.id,
                        CategoryType.SPEAKER,
                        req.body,
                        userId
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Category ${result.id} updated successfully`,
                        req.body.versionId,
                        AuditLogScope.TEAM_MEMBERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Category updated successfully',
                        null,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      deleteForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const { versionId } = req.query as any;
                  const isVersionExist = await this.flagshipEventVersion.findById(versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  await this.serviceForCategory.delete(
                        req.params.id,
                        CategoryType.SPEAKER,
                        userId
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Category ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.TEAM_MEMBERS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Category deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      };

      getAllForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.serviceForCategory.findAll(
                        req.query as any,
                        CategoryType.SPEAKER
                  );
                  if (!result.items.length) {
                        return responseHandler(res)('Categories not found', result, 200);
                  }
                  return responseHandler(res)(
                        'Categories fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      getByIdForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.serviceForCategory.findById(
                        req.params.id,
                  );
                  if (!result) {
                        return responseHandler(res)('Category not found', null, 200);
                  }
                  return responseHandler(res)(
                        'Category fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };
} 
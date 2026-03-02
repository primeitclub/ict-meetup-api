import { DataSource } from "typeorm";
import { EventService } from "../services/event.service";
import { Event as EventEntity } from "../entities/event.entity";
import { CategoryService } from "../../category/services/category.service";
import { NextFunction, Request, Response } from "express";
import { BaseController } from "../../../shared/base/base.controller";
import { FlagshipEventVersionService } from "../../flagship-event/services/flagship-event.service";
import { CategoryType } from "../../category/entities/category.entity";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";
import { AuditLogActionType, AuditLogScope, AuditLogType } from "../../../shared/constants/audit-log.constants";
import { AppError } from "../../../shared/utils/error.utils";

export class EventController extends BaseController {
      protected moduleName: string = 'EventController';
      private eventService: EventService;
      private serviceForCategory: CategoryService;
      private flagshipEventVersion: FlagshipEventVersionService;
      constructor(dataSource: DataSource) {
            super(dataSource);
            this.eventService = new EventService(dataSource);
            this.serviceForCategory = new CategoryService(dataSource);
            this.flagshipEventVersion = new FlagshipEventVersionService(dataSource);
      }

      create = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const result = await this.eventService.create(req.body, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Event ${result.id} created successfully`,
                        result.versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event created successfully', result, 201);
            } catch (error) {
                  next(error);
            }
      }

      update = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const result = await this.eventService.update(req.params.id, req.body, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Event ${result.id} updated successfully`,
                        result.versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event updated successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      delete = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const versionId = req.query.versionId as string;
                  await this.eventService.delete(req.params.id, versionId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Event ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      }

      getById = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventService.findById(req.params.id);
                  return responseHandler(res)('Event fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventService.findAll(req.query);
                  return responseHandler(res)('Events fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      getHighlighted = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventService.findByHighlighted(req.query);
                  return responseHandler(res)('Highlighted events fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      createForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  const result = await this.serviceForCategory.create(req.body, CategoryType.EVENT, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Category ${result.id} created successfully`,
                        req.body.versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event category created successfully', result, 201);
            } catch (error) {
                  next(error);
            }
      }

      updateForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  const result = await this.serviceForCategory.update(
                        req.params.id,
                        CategoryType.EVENT,
                        req.body,
                        userId
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Category ${result.id} updated successfully`,
                        req.body.versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event category updated successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }

      deleteForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user!.userId || 'system';
                  const { versionId } = req.query as any;
                  const isVersionExist = await this.flagshipEventVersion.findById(versionId);
                  if (!isVersionExist) {
                        return responseHandler(res)('Version not found', null, 404);
                  }
                  await this.serviceForCategory.delete(req.params.id, CategoryType.EVENT, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Category ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.EVENTS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event category deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      }

      getAllForCategory = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.serviceForCategory.findAll(req.query, CategoryType.EVENT);
                  if (!result.items.length) {
                        return responseHandler(res)('Categories not found', result, 200);
                  }
                  return responseHandler(res)('Event categories fetched successfully', result, 200);
            } catch (error) {
                  next(error);
            }
      }
}     
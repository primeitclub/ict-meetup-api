import { NextFunction, Request, Response } from "express";
import { EventRegistrationService } from "../services/event-registration.service";
import { CreateEventRegistrationDto, EventRegistrationIdParamDto, EventRegistrationQueryDto, UpdateEventRegistrationDto } from "../validators/event-registration.validator";
import { AppError } from "../../../shared/utils/error.utils";
import { BaseController } from "../../../shared/base/base.controller";
import { DataSource } from "typeorm";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";
import { AuditLogActionType, AuditLogScope, AuditLogType } from "../../../shared/constants/audit-log.constants";

export class EventRegistrationController extends BaseController {
      protected moduleName = "EventRegistrationService";
      private eventRegistrationService: EventRegistrationService;
      constructor(dataSource: DataSource) {
            super(dataSource);
            this.eventRegistrationService = new EventRegistrationService(dataSource);
      }

      create = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user?.userId || 'system';
                  const result = await this.eventRegistrationService.create(req.body);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.CREATE,
                        `Event Registration ${result.id} created`,
                        result.versionId,
                        AuditLogScope.EVENT_REGISTRATIONS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Event Registration created successfully',
                        result,
                        201
                  );
            } catch (error) {
                  next(error);
            }
      };

      getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventRegistrationService.findAll(req.query as any);
                  if (!result.items.length) {
                        return responseHandler(res)('Event Registrations not found', result, 200);
                  }
                  return responseHandler(res)(
                        'Event Registrations fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      getStatusCounts = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventRegistrationService.getStatusCounts(req.query as any);
                  return responseHandler(res)(
                        'Event registration status counts fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      getById = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.eventRegistrationService.findById(req.params.id);
                  if (!result) {
                        return responseHandler(res)('Event Registration not found', null, 200);
                  }
                  return responseHandler(res)(
                        'Event Registration fetched successfully',
                        result,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      updateStatus = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user?.userId || 'system';
                  const result = await this.eventRegistrationService.updateStatus(
                        req.params.id,
                        req.body.status,
                        req.body.rejectionReason,
                  );
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.UPDATE,
                        `Event Registration ${result.id} updated successfully`,
                        result.versionId,
                        AuditLogScope.EVENT_REGISTRATIONS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)(
                        'Event Registration updated successfully',
                        null,
                        200
                  );
            } catch (error) {
                  next(error);
            }
      };

      delete = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const userId = req.user?.userId || 'system';
                  const versionId = req.query.versionId as string;
                  await this.eventRegistrationService.delete(req.params.id, versionId, userId);
                  await this.createAuditLog(
                        AuditLogType.INFO,
                        AuditLogActionType.DELETE,
                        `Event Registration ${req.params.id} deleted successfully`,
                        versionId,
                        AuditLogScope.EVENT_REGISTRATIONS,
                        req.ip,
                        userId
                  );
                  return responseHandler(res)('Event Registration deleted successfully', null, 200);
            } catch (error) {
                  next(error);
            }
      };
}


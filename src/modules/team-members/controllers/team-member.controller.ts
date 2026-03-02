import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { TeamMemberService } from '../services/team-member.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { CategoryService } from '../../category/services/category.service';
import { DesignationService } from '../../designation/services/designation.service';
import { AuditLogActionType, AuditLogScope, AuditLogType } from '../../../shared/constants/audit-log.constants';
import { BaseController } from '../../../shared/base/base.controller';
import { FlagshipEventVersionService } from '../../flagship-event/services/flagship-event.service';
import { removeFile } from '../../../shared/utils/helpers/imageUpload.helper';
import { CategoryType } from '../../category/entities/category.entity';

export class TeamMemberController extends BaseController {
  private service: TeamMemberService;
  private serviceForCategory: CategoryService;
  private serviceForDesignation: DesignationService;
  private flagshipEventVersion: FlagshipEventVersionService;
  protected moduleName = 'TeamMemberService';

  constructor(dataSource: DataSource) {
    super(dataSource);
    this.service = new TeamMemberService(dataSource);
    this.serviceForCategory = new CategoryService(dataSource);
    this.serviceForDesignation = new DesignationService(dataSource);
    this.flagshipEventVersion = new FlagshipEventVersionService(dataSource)
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId || 'system';
      const result = await this.service.create(req.body);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        `Team member ${result.id} created`,
        result.versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Team member created successfully',
        null,
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
        return responseHandler(res)('Team members not found', result, 200);
      }
      return responseHandler(res)(
        'Team members fetched successfully',
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
        return responseHandler(res)('Team member not found', null, 200);
      }
      return responseHandler(res)(
        'Team member fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    let existingTeamMember: any = null;
    try {
      const userId = (req as any).user?.id || 'system';
      existingTeamMember = await this.service.findById(req.params.id);

      const result = await this.service.update(
        req.params.id,
        req.body,
      );
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        `Team member ${result.id} updated successfully`,
        result.versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Team member updated successfully',
        null,
        200
      );
    } catch (error) {
      // Only remove the newly uploaded file if it's different from the existing one
      if (req.body.imagePath && existingTeamMember && req.body.imagePath !== existingTeamMember.imagePath) {
        await removeFile(req.body.imagePath);
      }
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';

      const result = await this.service.delete(req.params.id);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        `Team member ${req.params.id} deleted successfully`,
        result.versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)('Team member deleted successfully', null, 200);
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
      const result = await this.serviceForCategory.create(req.body, CategoryType.TEAM, userId);
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
        CategoryType.TEAM,
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
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  deleteForCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      const { versionId } = req.query as any;
      const isVersionExist = await this.flagshipEventVersion.findById(versionId);
      if (!isVersionExist) {
        return responseHandler(res)('Version not found', null, 404);
      }
      await this.serviceForCategory.delete(req.params.id, CategoryType.TEAM, userId);
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
      const { versionId } = req.query as any;
      const isVersionExist = await this.flagshipEventVersion.findById(versionId);
      if (!isVersionExist) {
        return responseHandler(res)('Version not found', null, 404);
      }
      const result = await this.serviceForCategory.findAll(req.query as any, CategoryType.TEAM);
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

  createForDesignation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId || 'system';
      const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
      if (!isVersionExist) {
        return responseHandler(res)('Version not found', null, 404);
      }
      const result = await this.serviceForDesignation.create(req.body, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.CREATE,
        `Designation ${result.id} created successfully`,
        req.body.versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Designation created successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  updateForDesignation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId || 'system';
      const isVersionExist = await this.flagshipEventVersion.findById(req.body.versionId);
      if (!isVersionExist) {
        return responseHandler(res)('Version not found', null, 404);
      }
      const result = await this.serviceForDesignation.update(
        req.params.id,
        req.body,
        userId
      );
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.UPDATE,
        `Designation ${req.params.id} updated successfully`,
        req.body.versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)(
        'Designation updated successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  deleteForDesignation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId || 'system';
      const { versionId } = req.query as any;
      const isVersionExist = await this.flagshipEventVersion.findById(versionId);
      if (!isVersionExist) {
        return responseHandler(res)('Version not found', null, 404);
      }
      await this.serviceForDesignation.delete(req.params.id, userId);
      await this.createAuditLog(
        AuditLogType.INFO,
        AuditLogActionType.DELETE,
        `Designation ${req.params.id} deleted successfully`,
        versionId,
        AuditLogScope.TEAM_MEMBERS,
        req.ip,
        userId
      );
      return responseHandler(res)('Designation deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };

  getAllForDesignation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.serviceForDesignation.findAll(req.query as any);
      if (!result.items.length) {
        return responseHandler(res)('Designations not found', result, 200);
      }
      return responseHandler(res)(
        'Designations fetched successfully',
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };
}

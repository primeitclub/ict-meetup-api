import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { TeamMemberService } from '../services/team-member.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { CategoryService } from '../../category/services/category.service';
import { DesignationService } from '../../designation/services/designation.service';

export class TeamMemberController {
  private service: TeamMemberService;
  private serviceForCategory: CategoryService;
  private serviceForDesignation: DesignationService;
  constructor(dataSource: DataSource) {
    this.service = new TeamMemberService(dataSource);
    this.serviceForCategory = new CategoryService(dataSource);
    this.serviceForDesignation = new DesignationService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id || 'system';
      const result = await this.service.create(req.body, userId);
      return responseHandler(res)(
        'Team member created successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { versionId } = req.query as any;
      const result = await this.service.findAll({ versionId });
      if (!result.length) {
        return responseHandler(res)('Team members not found', null, 200);
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
    try {
      const userId = (req as any).user?.id || 'system';
      const result = await this.service.update(
        req.params.id,
        req.body,
        userId
      );
      return responseHandler(res)(
        'Team member updated successfully',
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
      const result = await this.service.delete(req.params.id, userId);
      return responseHandler(res)(result.message, null, 200);
    } catch (error) {
      next(error);
    }
  };

  createForCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id || 'system';
      const result = await this.serviceForCategory.create(req.body, userId);
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
      const userId = req.user.id || 'system';
      const result = await this.serviceForCategory.update(
        req.params.id,
        req.body,
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
      await this.serviceForCategory.delete(req.params.id, userId);
      return responseHandler(res)('Category deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };

  getAllForCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query as any;
      const result = await this.serviceForCategory.findAll(type);
      if (!result.length) {
        return responseHandler(res)('Categories not found', null, 200);
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
      const userId = req.user.id || 'system';
      const result = await this.serviceForDesignation.create(req.body, userId);
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
      const userId = req.user.id || 'system';
      const result = await this.serviceForDesignation.update(
        req.params.id,
        req.body,
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
      const userId = req.user.id || 'system';
      await this.serviceForDesignation.delete(req.params.id, userId);
      return responseHandler(res)('Designation deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };

  getAllForDesignation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.serviceForDesignation.findAll();
      if (!result) {
        return responseHandler(res)('Designations not found', null, 200);
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

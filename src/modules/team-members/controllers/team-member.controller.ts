import { NextFunction, Request, Response } from 'express';
import { TeamMemberService } from '../services/team-member.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';

export class TeamMemberController {
  private service: TeamMemberService;

  constructor() {
    this.service = new TeamMemberService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
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
      const { versionId, categoryId } = req.query as any;
      const result = await this.service.findAll({ versionId, categoryId });
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
}

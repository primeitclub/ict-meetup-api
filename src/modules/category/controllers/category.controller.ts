import { NextFunction, Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';
import { CategoryType } from '../entities/category.entity';

export class CategoryController {
  private service: CategoryService;

  constructor() {
    this.service = new CategoryService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      const result = await this.service.create(req.body, userId);
      return responseHandler(res)(
        'Category created successfully',
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.query;
      const result = await this.service.findAll(type as CategoryType);
      return responseHandler(res)(
        'Categories fetched successfully',
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
        'Category fetched successfully',
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
        'Category updated successfully',
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

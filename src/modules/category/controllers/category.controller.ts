import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { CategoryService } from '../services/category.service';
import { responseHandler } from '../../../shared/utils/helpers/response.helper';

export class CategoryController {
  private service: CategoryService;

  constructor(dataSource: DataSource) {
    this.service = new CategoryService(dataSource);
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || 'system';
      const { type, ...data } = req.body;
      const result = await this.service.create(data, type, userId);
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
      const result = await this.service.findAll(req.query, type as any);
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
      const { type, ...data } = req.body;
      const result = await this.service.update(
        req.params.id,
        type,
        data,
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
      const { type } = req.query;
      await this.service.delete(req.params.id, type as any, userId);
      return responseHandler(res)('Category deleted successfully', null, 200);
    } catch (error) {
      next(error);
    }
  };
}

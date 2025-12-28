import { NextFunction, Request, Response } from "express";
import {
  flagshipEventVersionSchema,
  updateFlagshipEventVersionSchema,
} from "../validators/flagship-event-version.validator";
import { responseHandler } from "../../../shared/middlewares/response.middleware";
import { AppError } from "../../../shared/utils/error.utils";
import { FlagshipEventVersionService } from "../services/event.service";

export class FlagshipEventVersionController {
  private service: FlagshipEventVersionService;

  constructor() {
    this.service = new FlagshipEventVersionService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = flagshipEventVersionSchema.parse(req.body);
      const userId = (req as any).user?.id || "system"; // Default to system if auth handled elsewhere
      const result = await this.service.create(validatedData, userId);
      return responseHandler(req, res, next)(
        "Flagship event version created successfully",
        result,
        201
      );
    } catch (error) {
      next(error);
    }
  };

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findAll();
      return responseHandler(req, res, next)(
        "Fetch all versions successfully",
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
      return responseHandler(req, res, next)(
        "Fetch version by id successfully",
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findBySlug(req.params.slug);
      return responseHandler(req, res, next)(
        "Fetch version by slug successfully",
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  getCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.service.findCurrent();
      if (!result) {
        throw new AppError("No active flagship event version found", 404);
      }
      return responseHandler(req, res, next)(
        "Fetch current active version successfully",
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateFlagshipEventVersionSchema.parse(req.body);
      const userId = (req as any).user?.id || "system";
      const result = await this.service.update(
        req.params.id,
        validatedData,
        userId
      );
      return responseHandler(req, res, next)(
        "Flagship event version updated successfully",
        result,
        200
      );
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id || "system";
      const result = await this.service.delete(req.params.id, userId);
      return responseHandler(req, res, next)(result.message, null, 200);
    } catch (error) {
      next(error);
    }
  };
}

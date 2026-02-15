import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/utils/error.utils";
import { FlagshipEventVersionService } from "../services/flagship-event.service";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";

export class FlagshipEventVersionController {
  private service: FlagshipEventVersionService;

  constructor() {
    this.service = new FlagshipEventVersionService();
  }

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const result = await this.service.create(req.body, userId);
      return responseHandler(res)(
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
      if (result.length === 0) {
        return responseHandler(res)(
          "No flagship event versions found",
          [],
          200
        );
      }
      return responseHandler(res)(
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
      if (!result) {
        return responseHandler(res)(
          "No flagship event version found",
          null,
          200
        );
      }
      return responseHandler(res)(
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
      if (!result) {
        return responseHandler(res)(
          "No flagship event version found",
          null,
          200
        );
      }
      return responseHandler(res)(
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
        return responseHandler(res)(
          "No active flagship event version found",
          null,
          200
        );
      }
      return responseHandler(res)(
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
      const userId = req.user!.userId;
      const result = await this.service.update(
        req.params.id,
        req.body,
        userId
      );
      return responseHandler(res)(
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
      const userId = req.user!.userId;
      const result = await this.service.delete(req.params.id, userId);
      return responseHandler(res)(result.message, null, 200);
    } catch (error) {
      next(error);
    }
  };
}
import { NextFunction, Request, Response } from "express";
import { SeedService } from "./seed.service";
import { sendResponse } from "../../shared/utils/response.utils";

export class SeedController {
  private seedService: SeedService;

  constructor() {
    this.seedService = new SeedService();
  }

  seedStaticUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.seedService.seedStaticUsers();
      sendResponse(res, "Static user seeding process completed", result, 200);
    } catch (error) {
      next(error);
    }
  };

  seedCustomUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData = req.body;
      const result = await this.seedService.seedUser(userData);
      sendResponse(res, "User created successfully", result, 201);
    } catch (error) {
      next(error);
    }
  };
}

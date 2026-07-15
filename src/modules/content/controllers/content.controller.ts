import { NextFunction, Request, Response } from "express";
import { DataSource } from "typeorm";
import { ContentService } from "../services/content.service";
import { responseHandler } from "../../../shared/utils/helpers/response.helper";

export class ContentController {
  private service: ContentService;

  constructor(dataSource: DataSource) {
    this.service = new ContentService(dataSource);
  }

  getHomeContent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug as string | undefined;
      const result = await this.service.getHomeContent(slug);
      return responseHandler(res)(
        "Fetched landing content successfully",
        result,
        200,
      );
    } catch (error) {
      next(error);
    }
  };
}

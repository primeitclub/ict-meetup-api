import { BaseController } from "../../../shared/base/base.controller";
import { DataSource } from "typeorm";
import { Request, Response, NextFunction } from "express";

export class AuditLogController extends BaseController {
      protected moduleName: string = "AuditLog";
      constructor(dataSource: DataSource) {
            super(dataSource);
      }

      getAll = async (req: Request, res: Response, next: NextFunction) => {
            try {
                  const result = await this.auditLogService.getAll(req.query as any);
                  return res.status(200).json(result);
            } catch (error: any) {
                  next(error);
            }
      }
}
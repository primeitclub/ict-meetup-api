import { BaseController } from "../../../shared/base/base.controller";
import { DataSource } from "typeorm";
import { Request, Response } from "express";

export class AuditLogController extends BaseController {
      protected moduleName: string = "AuditLog";
      constructor(dataSource: DataSource) {
            super(dataSource);
      }

      async getAll(req: Request, res: Response) {
            try {
                  const result = await this.auditLogService.getAll(req.query);
                  return res.status(200).json(result);
            } catch (error: any) {
                  return res.status(500).json({ message: error.message });
            }
      }
}
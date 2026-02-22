import { Router } from "express";
import { AuditLogController } from "../controllers/audit-log.controller";
import { DataSource } from "typeorm";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { validateRequestQuery } from "../../../shared/validators/request.validator";
import { auditLogQuerySchema } from "../validators/audit-log.validator";

const createAuditLogRouter = (dataSource: DataSource) => {
      const auditRouter = Router();
      const controller = new AuditLogController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/audit-logs:
       *   get:
       *     summary: Get all audit logs
       *     tags: [Audit Logs]
       *     responses:
       *       200:
       *         description: Audit logs fetched successfully
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 data: { type: array, items: { type: object } }
       *       401:
       *         description: Unauthorized
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       *       500:
       *         description: Internal server error
       *         content:
       *           application/json:
       *             schema:
       *               type: object
       *               properties:
       *                 message: { type: string }
       *                 error: { type: string }
       */
      auditRouter.get('/', authenticate, validateRequestQuery(auditLogQuerySchema), controller.getAll);
      return auditRouter;
}

export default createAuditLogRouter;
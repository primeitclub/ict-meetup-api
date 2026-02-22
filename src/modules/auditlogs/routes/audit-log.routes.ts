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
       *     parameters:
       *       - in: query
       *         name: versionId
       *         schema:
       *           type: string
       *         required: true
       *         description: The version ID
       *       - in: query
       *         name: page
       *         schema:
       *           type: number
       *         required: false
       *         description: The page number
       *       - in: query
       *         name: limit
       *         schema:
       *           type: number
       *         required: false
       *         description: The number of items per page
       *       - in: query
       *         name: search
       *         schema:
       *           type: string
       *         required: false
       *         description: The search term
       *       - in: query
       *         name: sortBy
       *         schema:
       *           type: string
       *         required: false
       *         description: The field to sort by
       *       - in: query
       *         name: sortOrder
       *         schema:
       *           type: string
       *         required: false
       *         description: The order to sort by
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
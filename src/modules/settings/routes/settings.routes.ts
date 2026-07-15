import { Router } from 'express';
import { DataSource } from 'typeorm';
import multer from 'multer';
import { SettingsController } from '../controllers/settings.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createSettingsSchema,
  updateSettingsSchema,
  settingsQuerySchema,
  settingsIdParamSchema,
} from '../validators/settings.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { z } from 'zod';

const versionIdQuerySchema = z.object({ versionId: z.string().uuid() });

const createSettingsRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new SettingsController(dataSource);
  const authenticate = createAuthenticate(dataSource);
  // Parse multipart/form-data fields (no file uploads on this route)
  const parseFormData = multer().none();

  /**
  * @swagger
  * /api/settings:
  *   post:
  *     summary: Create a new settings record
  *     tags: [Settings]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [versionId]
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               contactDepartments: { type: string, description: "JSON stringified array of {department, contacts}" }
  *     responses:
  *       201:
  *         description: Created
  */
  router.post('/', authenticate, parseFormData, validateRequestBody(createSettingsSchema), controller.create);

  /**
  * @swagger
  * /api/settings:
  *   get:
  *     summary: Get all settings
  *     tags: [Settings]
  *     parameters:
  *       - in: query
  *         name: versionId
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', validateRequestQuery(settingsQuerySchema), controller.getAll);

  /**
  * @swagger
  * /api/settings/contacts:
  *   get:
  *     summary: Get contact info (email, phone, department contacts) for a version
  *     tags: [Settings]
  *     parameters:
  *       - in: query
  *         name: versionId
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/contacts', validateRequestQuery(versionIdQuerySchema), controller.getContacts);

  /**
  * @swagger
  * /api/settings/{id}:
  *   get:
  *     summary: Get settings by ID
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/:id', validateRequestParams(settingsIdParamSchema), controller.getById);

  /**
  * @swagger
  * /api/settings/{id}:
  *   put:
  *     summary: Update settings
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     requestBody:
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               contactDepartments: { type: string, description: "JSON stringified array of {department, contacts}" }
  *     responses:
  *       200:
  *         description: OK
  */
  router.put('/:id', authenticate, parseFormData, validateRequestParams(settingsIdParamSchema), validateRequestBody(updateSettingsSchema), controller.update);

  /**
  * @swagger
  * /api/settings/{id}:
  *   delete:
  *     summary: Delete settings record
  *     tags: [Settings]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/:id', authenticate, validateRequestParams(settingsIdParamSchema), controller.delete);

  return router;
};

export default createSettingsRouter;

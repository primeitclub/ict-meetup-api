import { Router } from 'express';
import { DataSource } from 'typeorm';
import { SettingsController } from '../controllers/settings.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createSettingsSchema,
  updateSettingsSchema,
  settingsQuerySchema,
  settingsIdParamSchema,
} from '../validators/settings.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';

const createSettingsRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new SettingsController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/settings:
  *   post:
  *     summary: Create a new settings record
  *     tags: [Settings]
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             required: [versionId]
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               teamName: { type: string }
  *               socialMediaLinks: { type: string, description: "JSON stringified array of {platform, link}" }
  *               qrCode:
  *                 type: string
  *                 format: binary
  *                 description: QR code image
  *     responses:
  *       201:
  *         description: Created
  */
  router.post('/', authenticate, imageUploadHandler({ fieldName: 'qrCode', multiple: false, optional: true }), validateRequestBody(createSettingsSchema), controller.create);

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
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               versionId: { type: string, format: uuid }
  *               email: { type: string }
  *               phoneNumber: { type: string }
  *               teamName: { type: string }
  *               socialMediaLinks: { type: string, description: "JSON stringified array of {platform, link}" }
  *               qrCode:
  *                 type: string
  *                 format: binary
  *                 description: QR code image
  *     responses:
  *       200:
  *         description: OK
  */
  router.put('/:id', authenticate, imageUploadHandler({ fieldName: 'qrCode', multiple: false, optional: true }), validateRequestParams(settingsIdParamSchema), validateRequestBody(updateSettingsSchema), controller.update);

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

  /**
  * @swagger
  * /api/settings/{id}/qrcode:
  *   delete:
  *     summary: Remove only the QR code from settings
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
  router.delete('/:id/qrcode', authenticate, validateRequestParams(settingsIdParamSchema), controller.removeQrCode);

  return router;
};

export default createSettingsRouter;

import { Router } from 'express';
import { DataSource } from 'typeorm';
import { SiteSettingsController } from '../controllers/site-settings.controller';
import { validateRequestBody } from '../../../shared/validators/request.validator';
import { upsertSiteSettingsSchema } from '../validators/site-settings.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { siteSettingsUploadHandler } from '../middlewares/site-settings-upload.middleware';

const createSiteSettingsRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new SiteSettingsController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/site-settings:
  *   get:
  *     summary: Get the global club settings (club contact, social links, payment QR code)
  *     tags: [SiteSettings]
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', controller.get);

  /**
  * @swagger
  * /api/site-settings:
  *   put:
  *     summary: Create or update the global club settings
  *     tags: [SiteSettings]
  *     requestBody:
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               clubEmail: { type: string }
  *               clubPhoneNumber: { type: string }
  *               socialMediaLinks: { type: string, description: "JSON stringified array of {platform, link}" }
  *               qrCode:
  *                 type: string
  *                 format: binary
  *                 description: Payment QR code image
  *               proposalPdf:
  *                 type: string
  *                 format: binary
  *                 description: Sponsorship proposal PDF
  *     responses:
  *       200:
  *         description: OK
  */
  router.put(
    '/',
    authenticate,
    siteSettingsUploadHandler(),
    validateRequestBody(upsertSiteSettingsSchema),
    controller.update
  );

  /**
  * @swagger
  * /api/site-settings/qrcode:
  *   delete:
  *     summary: Remove the payment QR code from the global club settings
  *     tags: [SiteSettings]
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/qrcode', authenticate, controller.removeQrCode);

  /**
  * @swagger
  * /api/site-settings/proposal:
  *   delete:
  *     summary: Remove the sponsorship proposal PDF from the global club settings
  *     tags: [SiteSettings]
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/proposal', authenticate, controller.removeProposal);

  return router;
};

export default createSiteSettingsRouter;

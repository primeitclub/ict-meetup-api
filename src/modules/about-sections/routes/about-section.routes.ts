import { Router } from 'express';
import { DataSource } from 'typeorm';
import { AboutSectionController } from '../controllers/about-section.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createAboutSectionSchema,
  updateAboutSectionSchema,
  aboutSectionIdParamSchema,
  aboutSectionQuerySchema,
} from '../validators/about-section.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';
import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';

const createAboutSectionRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new AboutSectionController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/about-sections:
  *   post:
  *     summary: Create a new about section
  *     tags: [AboutSections]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [flagshipEventVersionId]
  *             properties:
  *               flagshipEventVersionId: { type: string, format: uuid }
  *               title: { type: string }
  *               content: { type: string }
  *               image: { type: string, format: binary }
  *     responses:
  *       201:
  *         description: Created
  */
  router.post('/', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(createAboutSectionSchema), controller.create);

  /**
  * @swagger
  * /api/about-sections:
  *   get:
  *     summary: Get all about sections
  *     tags: [AboutSections]
  *     parameters:
  *       - in: query
  *         name: flagshipEventVersionId
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', validateRequestQuery(aboutSectionQuerySchema), controller.getAll);

  /**
  * @swagger
  * /api/about-sections/{id}:
  *   get:
  *     summary: Get about section by ID
  *     tags: [AboutSections]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/:id', controller.getById);

  /**
  * @swagger
  * /api/about-sections/{id}:
  *   put:
  *     summary: Update an about section
  *     tags: [AboutSections]
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
  *               flagshipEventVersionId: { type: string, format: uuid }
  *               title: { type: string }
  *               content: { type: string }
  *               image: { type: string, format: binary }
  *     responses:
  *       200:
  *         description: OK
  */
  router.put('/:id', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(updateAboutSectionSchema), controller.update);

  /**
  * @swagger
  * /api/about-sections/{id}:
  *   delete:
  *     summary: Delete an about section
  *     tags: [AboutSections]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/:id', authenticate, controller.delete);

  return router;
};

export default createAboutSectionRouter;

import { Router } from "express";
import { SpeakerController } from "../controllers/speaker.controller";
import { DataSource } from "typeorm";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { validateRequestBody, validateRequestQuery } from "../../../shared/validators/request.validator";
import { createSpeakerSchema, updateSpeakerSchema, deleteSpeakerQuerySchema } from "../validators/speaker.validator";
import { createCategorySchema, updateCategorySchema } from "../../category/validators/category.validator";
import { imageUploadHandler } from "../../../shared/utils/helpers/imageUpload.helper";

const createSpeakerRouter = (dataSource: DataSource) => {
      const router = Router();
      const controller = new SpeakerController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/speakers:
       *   post:
       *     summary: Create a new speaker
       *     tags: [Speakers]
       *     requestBody:
       *       required: true
       *       content:
       *         multipart/form-data:
       *           schema:
       *             type: object
       *             required: [name, image, designation, company, versionId, categoryId]
       *             properties:
       *               name: { type: string }
       *               image: { type: string, format: binary }
       *               designation: { type: string }
       *               company: { type: string }
       *               versionId: { type: string, format: uuid }
       *               categoryId: { type: string, format: uuid }
       *               displayOrder: { type: number, default: 0 }
       *               socialLinks:
       *                 type: object
       *                 properties:
       *                   instagram: { type: string }
       *                   linkedin: { type: string }
       *                   portfolio: { type: string }
       *     responses:
       *       201:
       *         description: Speaker created successfully
       *       401:
       *         description: Unauthorized
       */
      router.post('/', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(createSpeakerSchema), controller.create);

      /**
       * @swagger
       * /api/speakers:
       *   get:
       *     summary: Get all speakers
       *     tags: [Speakers]
       *     parameters:
       *       - in: query
       *         name: versionId
       *         schema: { type: string, format: uuid }
       *       - in: query
       *         name: categoryId
       *         schema: { type: string, format: uuid }
       *       - in: query
       *         name: page
       *         schema: { type: integer, default: 1 }
       *       - in: query
       *         name: limit
       *         schema: { type: integer, default: 10 }
       *     responses:
       *       200:
       *         description: List of speakers
       */
      router.get('/', controller.getAll);

      /**
       * @swagger
       * /api/speakers/category:
       *   post:
       *     summary: Create a new category for speakers
       *     tags: [SpeakerCategories]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required: true
       *             properties:
       *               name: { type: string }
       *               versionId: { type: string, format: uuid }
       *               displayName: { type: string, minLength: 1, maxLength: 150 }
       *               displayOrder: { type: number, default: 1 }
       *     responses:
       *       201:
       *         description: Category created successfully
       *       401:
       *         description: Unauthorized
       */
      router.post('/category', authenticate, validateRequestBody(createCategorySchema), controller.createForCategory);

      /**
       * @swagger
       * /api/speakers/category:
       *   get:
       *     summary: Get all speaker categories
       *     tags: [SpeakerCategories]
       *     parameters:
       *       - in: query
       *         name: page
       *         schema: { type: integer, default: 1 }
       *       - in: query
       *         name: limit
       *         schema: { type: integer, default: 10 }
       *     responses:
       *       200:
       *         description: List of speaker categories
       */
      router.get('/category', controller.getAllForCategory);

      /**
       * @swagger
       * /api/speakers/category/{id}:
       *   get:
       *     summary: Get speaker category by ID
       *     tags: [SpeakerCategories]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Category details
       *       404:
       *         description: Category not found
       */
      router.get('/category/:id', controller.getByIdForCategory);

      /**
       * @swagger
       * /api/speakers/category/{id}:
       *   put:
       *     summary: Update an existing speaker category
       *     tags: [SpeakerCategories]
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
       *               name: { type: string }
       *               versionId: { type: string, format: uuid }
       *               displayName: { type: string, minLength: 1, maxLength: 150 }
       *               displayOrder: { type: number }
       *     responses:
       *       200:
       *         description: Category updated successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Category not found
       */
      router.put('/category/:id', authenticate, validateRequestBody(updateCategorySchema), controller.updateForCategory);

      /**
       * @swagger
       * /api/speakers/category/{id}:
       *   delete:
       *     summary: Delete a speaker category
       *     tags: [SpeakerCategories]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *       - in: query
       *         name: versionId
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Category deleted successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Category not found
       */
      router.delete('/category/:id', authenticate, controller.deleteForCategory);

      /**
       * @swagger
       * /api/speakers/{id}:
       *   get:
       *     summary: Get speaker by ID
       *     tags: [Speakers]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Speaker details
       *       404:
       *         description: Speaker not found
       */
      router.get('/:id', controller.getById);

      /**
       * @swagger
       * /api/speakers/{id}:
       *   put:
       *     summary: Update an existing speaker
       *     tags: [Speakers]
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
       *               name: { type: string }
       *               image: { type: string, format: binary }
       *               designation: { type: string }
       *               company: { type: string }
       *               versionId: { type: string, format: uuid }
       *               categoryId: { type: string, format: uuid }
       *               displayOrder: { type: number }
       *               socialLinks:
       *                 type: object
       *                 properties:
       *                   instagram: { type: string }
       *                   linkedin: { type: string }
       *                   portfolio: { type: string }
       *     responses:
       *       200:
       *         description: Speaker updated successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Speaker not found
       */
      router.put('/:id', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false, optional: true }), validateRequestBody(updateSpeakerSchema), controller.update);

      /**
       * @swagger
       * /api/speakers/{id}:
       *   delete:
       *     summary: Delete a speaker
       *     tags: [Speakers]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *       - in: query
       *         name: versionId
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Speaker deleted successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Speaker not found
       */
      router.delete('/:id', authenticate, validateRequestQuery(deleteSpeakerQuerySchema), controller.delete);

      return router;
}

export default createSpeakerRouter;
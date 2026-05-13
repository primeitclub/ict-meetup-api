import { Router } from "express";
import { SponsorController } from "../controllers/sponsor.controller";
import { DataSource } from "typeorm";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { validateRequestBody, validateRequestQuery } from "../../../shared/validators/request.validator";
import { createSponsorSchema, updateSponsorSchema, deleteSponsorQuerySchema } from "../validators/sponsor.validator";
import { createCategorySchema, updateCategorySchema } from "../../category/validators/category.validator";
import { imageUploadHandler } from "../../../shared/utils/helpers/imageUpload.helper";

const createSponsorRouter = (dataSource: DataSource) => {
      const router = Router();
      const controller = new SponsorController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/sponsors:
       *   post:
       *     summary: Create a new sponsor
       *     tags: [Sponsors]
       *     requestBody:
       *       required: true
       *       content:
       *         multipart/form-data:
       *           schema:
       *             type: object
       *             required: [name, image, versionId, categoryId]
       *             properties:
       *               name: { type: string }
       *               link: { type: string }
       *               versionId: { type: string, format: uuid }
       *               categoryId: { type: string, format: uuid }
       *               image: { type: string, format: binary }
       *               displayOrder: { type: number, default: 0 }
      
       *     responses:
       *       201:
       *         description: Sponsor created successfully
       *       401:
       *         description: Unauthorized
       */
      router.post('/', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(createSponsorSchema), controller.create);

      /**
       * @swagger
       * /api/sponsors:
       *   get:
       *     summary: Get all sponsors
       *     tags: [Sponsors]
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
       *         description: List of sponsors
       */
      router.get('/', controller.getAll);

      /**
       * @swagger
       * /api/sponsors/category:
       *   post:
       *     summary: Create a new category for sponsors
       *     tags: [SponsorCategories]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required: true
       *             properties:
       *               name: { type: string }
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
       * /api/sponsors/category:
       *   get:
       *     summary: Get all sponsor categories
       *     tags: [SponsorCategories]
       *     parameters:
       *       - in: query
       *         name: page
       *         schema: { type: integer, default: 1 }
       *       - in: query
       *         name: limit
       *         schema: { type: integer, default: 10 }
       *     responses:
       *       200:
       *         description: List of sponsor categories
       */
      router.get('/category', controller.getAllForCategory);

      /**
       * @swagger
       * /api/sponsors/category/{id}:
       *   get:
       *     summary: Get sponsor category by ID
       *     tags: [SponsorCategories]
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
       * /api/sponsors/category/{id}:
       *   put:
       *     summary: Update an existing sponsor category
       *     tags: [SponsorCategories]
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
       * /api/sponsors/category/{id}:
       *   delete:
       *     summary: Delete a sponsor category
       *     tags: [SponsorCategories]
       *     parameters:
       *       - in: path
       *         name: id
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
       * /api/sponsors/{id}:
       *   get:
       *     summary: Get sponsor by ID
       *     tags: [Sponsors]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Sponsor details
       *       404:
       *         description: Sponsor not found
       */
      router.get('/:id', controller.getById);

      /**
       * @swagger
       * /api/sponsors/{id}:
       *   put:
       *     summary: Update an existing sponsor
       *     tags: [Sponsors]
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
       *               link: { type: string }
       *               versionId: { type: string, format: uuid }
       *               categoryId: { type: string, format: uuid }
       *               image: { type: string, format: binary }
       *               displayOrder: { type: number }
       *     responses:
       *       200:
       *         description: Sponsor updated successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Sponsor not found
       */
      router.put('/:id', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false, optional: true }), validateRequestBody(updateSponsorSchema), controller.update);

      /**
       * @swagger
       * /api/sponsors/{id}:
       *   delete:
       *     summary: Delete a sponsor
       *     tags: [Sponsors]
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
       *         description: Sponsor deleted successfully
       *       401:
       *         description: Unauthorized
       *       404:
       *         description: Sponsor not found
       */
      router.delete('/:id', authenticate, validateRequestQuery(deleteSponsorQuerySchema), controller.delete);

      return router;
}

export default createSponsorRouter;

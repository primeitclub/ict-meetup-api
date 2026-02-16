import { Router } from 'express';
import { DataSource } from 'typeorm';
import { CategoryController } from '../controllers/category.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdParamSchema,
  categoryQuerySchema,
} from '../validators/category.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';

const createCategoryRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new CategoryController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
   * @swagger
   * /api/categories:
   *   post:
   *     summary: Create a new category
   *     tags: [Categories]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [type, name]
   *             properties:
   *               type: { type: string, enum: [teams, sponsors] }
   *               name: { type: string, minLength: 1, maxLength: 100 }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', authenticate, validateRequestBody(createCategorySchema), controller.create);

  /**
   * @swagger
   * /api/categories:
   *   get:
   *     summary: Get all categories
   *     tags: [Categories]
   *     parameters:
   *       - in: query
   *         name: type
   *         schema: { type: string, enum: [teams, sponsors] }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', authenticate, validateRequestQuery(categoryQuerySchema), controller.getAll);

  /**
   * @swagger
   * /api/categories/{id}:
   *   get:
   *     summary: Get category by ID
   *     tags: [Categories]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/:id', authenticate, controller.getById);

  /**
   * @swagger
   * /api/categories/{id}:
   *   put:
   *     summary: Update a category
   *     tags: [Categories]
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
   *               type: { type: string, enum: [teams, sponsors] }
   *               name: { type: string, minLength: 1, maxLength: 100 }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/:id', authenticate, validateRequestBody(updateCategorySchema), controller.update);

  /**
   * @swagger
   * /api/categories/{id}:
   *   delete:
   *     summary: Delete a category
   *     tags: [Categories]
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

export default createCategoryRouter;

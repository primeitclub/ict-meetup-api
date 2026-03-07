import { Router } from 'express';
import { DataSource } from 'typeorm';
import { HeroSectionController } from '../controllers/hero-section.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createHeroSectionSchema,
  updateHeroSectionSchema,
  heroSectionIdParamSchema,
  heroSectionQuerySchema,
} from '../validators/hero-section.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';

const createHeroSectionRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new HeroSectionController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/hero-sections:
  *   post:
  *     summary: Create a new hero section
  *     tags: [HeroSections]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             required: [flagshipEventVersionId]
  *             properties:
  *               flagshipEventVersionId: { type: string, format: uuid }
  *               heading: { type: string }
  *               paragraph: { type: string }
  *               extraOptions: { type: object }
  *     responses:
  *       201:
  *         description: Created
  */
  router.post('/', authenticate, validateRequestBody(createHeroSectionSchema), controller.create);

  /**
  * @swagger
  * /api/hero-sections:
  *   get:
  *     summary: Get all hero sections
  *     tags: [HeroSections]
  *     parameters:
  *       - in: query
  *         name: flagshipEventVersionId
  *         schema: { type: string, format: uuid }
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', validateRequestQuery(heroSectionQuerySchema), controller.getAll);

  /**
  * @swagger
  * /api/hero-sections/{id}:
  *   get:
  *     summary: Get hero section by ID
  *     tags: [HeroSections]
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
  * /api/hero-sections/{id}:
  *   put:
  *     summary: Update a hero section
  *     tags: [HeroSections]
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
  *               heading: { type: string }
  *               paragraph: { type: string }
  *               extraOptions: { type: object }
  *     responses:
  *       200:
  *         description: OK
  */
  router.put('/:id', authenticate, validateRequestBody(updateHeroSectionSchema), controller.update);

  /**
  * @swagger
  * /api/hero-sections/{id}:
  *   delete:
  *     summary: Delete a hero section
  *     tags: [HeroSections]
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

export default createHeroSectionRouter;

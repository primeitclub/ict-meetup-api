import { Router } from 'express';
import { DataSource } from 'typeorm';
import { FaqController } from '../controllers/faq.controller';
import { validateRequestBody, validateRequestQuery } from '../../../shared/validators/request.validator';
import {
  createFaqSchema,
  updateFaqSchema,
  faqIdParamSchema,
  faqQuerySchema,
} from '../validators/faq.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';

const createFaqRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new FaqController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
   * @swagger
   * /api/faqs:
   *   post:
   *     summary: Create faqs for a version (bulk)
   *     tags: [FAQs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [versionId, faqs]
   *             properties:
   *               versionId: { type: string, format: uuid }
   *               faqs:
   *                 type: array
   *                 minItems: 1
   *                 items:
   *                   type: object
   *                   required: [title, description]
   *                   properties:
   *                     title: { type: string, minLength: 1, maxLength: 255 }
   *                     description: { type: string, minLength: 1, maxLength: 1000 }
   *     responses:
   *       201:
   *         description: Created
   */
  router.post('/', authenticate, validateRequestBody(createFaqSchema), controller.create);

  /**
   * @swagger
   * /api/faqs:
   *   get:
   *     summary: Get all faqs
   *     tags: [FAQs]
   *     parameters:
   *       - in: query
   *         name: versionId
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validateRequestQuery(faqQuerySchema), controller.getAll);

  /**
   * @swagger
   * /api/faqs/grouped:
   *   get:
   *     summary: Get all faqs grouped by version
   *     tags: [FAQs]
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/grouped', controller.getAllGrouped);

  /**
   * @swagger
   * /api/faqs/{id}:
   *   get:
   *     summary: Get faq by ID
   *     tags: [FAQs]
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
   * /api/faqs:
   *   put:
   *     summary: Sync faqs for a version (update existing, add new, remove omitted)
   *     tags: [FAQs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [versionId, faqs]
   *             properties:
   *               versionId: { type: string, format: uuid }
   *               faqs:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required: [title, description]
   *                   properties:
   *                     id: { type: string, format: uuid, description: "Omit for new faqs" }
   *                     title: { type: string, minLength: 1, maxLength: 255 }
   *                     description: { type: string, minLength: 1, maxLength: 1000 }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/', authenticate, validateRequestBody(updateFaqSchema), controller.update);

  return router;
};

export default createFaqRouter;

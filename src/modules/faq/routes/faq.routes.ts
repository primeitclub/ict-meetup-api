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
   *     summary: Create a new faq
   *     tags: [FAQs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [flagshipEventVersionId, title]
   *             properties:
   *               flagshipEventVersionId: { type: string, format: uuid }
   *               title: { type: string, minLength: 1, maxLength: 255 }
   *               description: { type: string }
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
   *         name: flagshipEventVersionId
   *         schema: { type: string, format: uuid }
   *     responses:
   *       200:
   *         description: OK
   */
  router.get('/', validateRequestQuery(faqQuerySchema), controller.getAll);

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
   * /api/faqs/{id}:
   *   put:
   *     summary: Update a faq
   *     tags: [FAQs]
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
   *               title: { type: string, minLength: 1, maxLength: 255 }
   *               description: { type: string }
   *     responses:
   *       200:
   *         description: OK
   */
  router.put('/:id', authenticate, validateRequestBody(updateFaqSchema), controller.update);

  /**
   * @swagger
   * /api/faqs/{id}:
   *   delete:
   *     summary: Delete a faq
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
  router.delete('/:id', authenticate, controller.delete);

  return router;
};

export default createFaqRouter;

import { Router } from "express";
import { createEventSchema, deleteEventQuerySchema, updateEventSchema } from "../validators/event.validator";
import { EventController } from "../contollers/event.controller";
import { DataSource } from "typeorm";
import { validateRequestBody, validateRequestQuery } from "../../../shared/validators/request.validator";
import { imageUploadHandler } from "../../../shared/utils/helpers/imageUpload.helper";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { createCategorySchema, updateCategorySchema } from "../../category/validators/category.validator";

const createEventRouter = (dataSource: DataSource) => {
      const router = Router();
      const eventController = new EventController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/events:
       *   post:
       *     summary: Create a new event
       *     tags: [Events]
       *     requestBody:
       *       required: true
       *       content:
       *         multipart/form-data:
       *           schema:
       *             type: object
       *             properties:
       *               title: { type: string }
       *               subtitle: { type: string }
       *               description: { type: string }
       *               startTime: { type: string, format: date-time }
       *               endTime: { type: string, format: date-time }
       *               date: { type: string, format: date-time }
       *               categoryId: { type: string }
       *               versionId: { type: string }
       *               speakerId: { type: string }
       *               totalSeats: { type: number }
       *               feeType: { type: string, enum: [FREE, PAID] }
       *               fee: { type: string }
       *               location: { type: string }
       *               status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
       *               registrationDeadline: { type: string, format: date-time }
       *               displayOrder: { type: number }
       *               image: { type: string, format: binary }
       *     responses:
       *       201:
       *         description: Event created successfully
       *       401:
       *         description: Unauthorized
       */
      router.post('/', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(createEventSchema), eventController.create);

      /**
       * @swagger
       * /api/events/{id}:
       *   patch:
       *     summary: Update an existing event
       *     tags: [Events]
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
       *               title: { type: string }
       *               subtitle: { type: string }
       *               description: { type: string }
       *               startTime: { type: string, format: date-time }
       *               endTime: { type: string, format: date-time }
       *               date: { type: string, format: date-time }
       *               categoryId: { type: string }
       *               versionId: { type: string }
       *               speakerId: { type: string }
       *               totalSeats: { type: number }
       *               feeType: { type: string, enum: [FREE, PAID] }
       *               fee: { type: string }
       *               location: { type: string }
       *               status: { type: string, enum: [DRAFT, PUBLISHED, ARCHIVED] }
       *               registrationDeadline: { type: string, format: date-time }
       *               displayOrder: { type: number }
       *               image: { type: string, format: binary }
       *     responses:
       *       200:
       *         description: Event updated successfully
       *       401:
       *         description: Unauthorized
       */
      router.patch('/:id', authenticate, imageUploadHandler({ fieldName: 'image', multiple: false }), validateRequestBody(updateEventSchema), eventController.update);

      /**
       * @swagger
       * /api/events:
       *   get:
       *     summary: Get all events
       *     tags: [Events]
       *     parameters:
       *       - in: query
       *         name: versionId
       *         schema: { type: string }
       *       - in: query
       *         name: categoryId
       *         schema: { type: string }
       *       - in: query
       *         name: page
       *         schema: { type: integer, default: 1 }
       *       - in: query
       *         name: limit
       *         schema: { type: integer, default: 10 }
       *     responses:
       *       200:
       *         description: List of events
       */
      router.get('/', eventController.getAll);

      /**
       * @swagger
       * /api/events/highlighted:
       *   get:
       *     summary: Get highlighted events
       *     tags: [Events]
       *     responses:
       *       200:
       *         description: List of highlighted events
       */
      router.get('/highlighted', eventController.getHighlighted);

      /**
       * @swagger
       * /api/events/category:
       *   post:
       *     summary: Create a new category for events
       *     tags: [EventCategories]
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             required: [name, versionId]
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
      router.post('/category', authenticate, validateRequestBody(createCategorySchema), eventController.createForCategory);

      /**
       * @swagger
       * /api/events/category:
       *   get:
       *     summary: Get all event categories
       *     tags: [EventCategories]
       *     responses:
       *       200:
       *         description: List of event categories
       */
      router.get('/category', eventController.getAllForCategory);

      /**
       * @swagger
       * /api/events/category/{id}:
       *   patch:
       *     summary: Update an existing event category
       *     tags: [EventCategories]
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
       */
      router.patch('/category/:id', authenticate, validateRequestBody(updateCategorySchema), eventController.updateForCategory);

      /**
       * @swagger
       * /api/events/category/{id}:
       *   delete:
       *     summary: Delete an event category
       *     tags: [EventCategories]
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
       */
      router.delete('/category/:id', authenticate, eventController.deleteForCategory);

      /**
       * @swagger
       * /api/events/{id}:
       *   get:
       *     summary: Get event by ID
       *     tags: [Events]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: Event details
       *       404:
       *         description: Event not found
       */
      router.get('/:id', eventController.getById);

      /**
       * @swagger
       * /api/events/{id}:
       *   delete:
       *     summary: Delete an event
       *     tags: [Events]
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
       *         description: Event deleted successfully
       *       401:
       *         description: Unauthorized
       */
      router.delete('/:id', authenticate, validateRequestQuery(deleteEventQuerySchema), eventController.delete);

      return router;
}

export default createEventRouter;
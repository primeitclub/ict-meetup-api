import { Router } from "express";
import { EventRegistrationController } from "../controllers/event-registration.controller";
import { DataSource } from "typeorm";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { imageUploadHandler } from "../../../shared/utils/helpers/imageUpload.helper";
import { validateRequestBody, validateRequestParams, validateRequestQuery } from "../../../shared/validators/request.validator";
import { createEventRegistrationSchema, eventRegistrationIdParamSchema, eventRegistrationQuerySchema } from "../validators/event-registration.validator";
import { z } from "zod";

const createEventRegistrationRouter = (dataSource: DataSource) => {
      const router = Router();
      const authenticate = createAuthenticate(dataSource);
      const eventRegistrationController = new EventRegistrationController(dataSource);
      /**
       * @swagger
       * /api/event-registrations:
       *   post:
       *     summary: Create a new event registration
       *     tags: [EventRegistration]
       *     requestBody:
       *       required: true
       *       content:
       *         multipart/form-data:
       *           schema:
       *             type: object
       *             properties:
       *               username: { type: string }
       *               email: { type: string, format: email }
       *               contactNumber: { type: string }
       *               isStudent: { type: boolean }
       *               educationLevel: { type: string }
       *               faculty: { type: string }
       *               year: { type: number }
       *               eventId: { type: string }
       *               versionId: { type: string }
       *               status: { type: string, enum: [pending, approved, rejected] }
       *               image: { type: string, format: binary }
       *     responses:
       *       201:
       *         description: Event registration created successfully
       *       401:
       *         description: Unauthorized
       */
      router.post(
            '/',
            imageUploadHandler({ fieldName: 'image', multiple: false, optional: true }),
            (req, _res, next) => {
                  if (req.body.imageUrl) {
                        req.body.attachedPaymentScreenshot = req.body.imageUrl;
                  } else if (req.body.imageLocalUrl) {
                        req.body.attachedPaymentScreenshot = req.body.imageLocalUrl;
                  }
                  next();
            },
            validateRequestBody(createEventRegistrationSchema),
            eventRegistrationController.create
      );
      /**
       * @swagger
       * /api/event-registrations:
       *   get:
       *     summary: Get all event registrations
       *     tags: [EventRegistration]
       *     parameters:
       *       - in: query
       *         name: eventId
       *         required: true
       *         schema: { type: string }
       *     responses:
       *       200:
       *         description: List of event registrations
       */
      router.get(
            '/',
            validateRequestQuery(eventRegistrationQuerySchema),
            eventRegistrationController.getAll
      );
      /**
       * @swagger
       * /api/event-registrations/{id}:
       *   get:
       *     summary: Get event registration by ID
       *     tags: [EventRegistration]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string }
       *     responses:
       *       200:
       *         description: Event registration details
       *       404:
       *         description: Event registration not found
       */
      router.get(
            '/:id',
            validateRequestParams(eventRegistrationIdParamSchema),
            eventRegistrationController.getById
      );
      /**
       * @swagger
       * /api/event-registrations/{id}/status:
       *   put:
       *     summary: Update event registration status
       *     tags: [EventRegistration]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string }
       *     requestBody:
       *       required: true
       *       content:
       *         application/json:
       *           schema:
       *             type: object
       *             properties:
       *               status: { type: string, enum: [pending, approved, rejected] }
       *     responses:
       *       200:
       *         description: Status updated successfully
       *       401:
       *         description: Unauthorized
       */
      router.put(
            '/:id/status',
            authenticate,
            validateRequestParams(eventRegistrationIdParamSchema),
            validateRequestBody(z.object({ status: z.string() })),
            eventRegistrationController.updateStatus
      );
      /**
       * @swagger
       * /api/event-registration/{id}:
       *   delete:
       *     summary: Delete event registration
       *     tags: [EventRegistration]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string }
       *       - in: query
       *         name: versionId
       *         required: true
       *         schema: { type: string }
       *     responses:
       *       200:
       *         description: Event registration deleted successfully
       *       401:
       *         description: Unauthorized
       */
      router.delete(
            '/:id',
            authenticate,
            validateRequestParams(eventRegistrationIdParamSchema),
            eventRegistrationController.delete
      );
      return router;
}

export default createEventRegistrationRouter;


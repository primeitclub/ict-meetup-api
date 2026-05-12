import { Router } from "express";
import { DataSource } from "typeorm";
import { FlagshipEventVersionController } from "../controllers/flagship-event.controller";
import { validateRequestBody, validateRequestQuery } from "../../../shared/validators/request.validator";
import { flagshipEventVersionSchema, updateFlagshipEventVersionSchema, flagshipEventQuerySchema } from "../validators/flagship-event.validator";
import { createAuthenticate } from "../../../shared/middlewares/auth.middleware";
import { imageUploadHandler } from "../../../shared/utils/helpers/imageUpload.helper";

const createVersionRouter = (dataSource: DataSource) => {
      const versionRouter = Router();
      const controller = new FlagshipEventVersionController(dataSource);
      const authenticate = createAuthenticate(dataSource);

      /**
       * @swagger
       * /api/flagship-event/versions:
       *   post:
       *     summary: Create a new flagship event version
       *     tags: [FlagshipEventVersions]
       *     requestBody:
       *       required: true
       *       content:
       *         multipart/form-data:
       *           schema:
       *             type: object
       *             required:
       *               - version_name
       *               - slug
       *               - version_number
       *               - start_date
       *               - end_date
       *               - logo
       *             properties:
       *               version_name:
       *                 type: string
       *               slug:
       *                 type: string
       *               version_number:
       *                 type: number
       *               start_date:
       *                 type: string
       *                 format: date
       *               end_date:
       *                 type: string
       *                 format: date
       *               status:
       *                 type: string
       *                 enum:
       *                   - draft
       *                   - active
       *                   - archived
       *               tagline:
       *                 type: string
       *               is_current:
       *                 type: boolean
       *               logo:
       *                 type: string
       *                 format: binary
       *     responses:
       *       201:
       *         description: Created
       */
      versionRouter.post("/", authenticate, imageUploadHandler({ fieldName: "logo", multiple: false,optional:true }), validateRequestBody(flagshipEventVersionSchema), controller.create);

      /**
       * @swagger
       * /api/flagship-event/versions:
       *   get:
       *     summary: Get all flagship event versions
       *     tags: [FlagshipEventVersions]
       *     parameters:
       *       - in: query
       *         name: page
       *         schema: { type: number , default: 1}
       *       - in: query
       *         name: limit
       *         schema: { type: number , default: 10}
       *       - in: query
       *         name: search
       *         schema: { type: string }
       *       - in: query
       *         name: sortBy
       *         schema: { type: string }
       *       - in: query
       *         name: sortOrder
       *         schema: { type: string }
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.get("/", validateRequestQuery(flagshipEventQuerySchema), controller.getAll);

      /**
       * @swagger
       * /api/flagship-event/versions/current:
       *   get:
       *     summary: Get the current active version
       *     tags: [FlagshipEventVersions]
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.get("/current", controller.getCurrent);

      /**
       * @swagger
       * /api/flagship-event/versions/{id}:
       *   get:
       *     summary: Get version by ID
       *     tags: [FlagshipEventVersions]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.get("/:id", controller.getById);

      /**
       * @swagger
       * /api/flagship-event/versions/slug/{slug}:
       *   get:
       *     summary: Get version by slug
       *     tags: [FlagshipEventVersions]
       *     parameters:
       *       - in: path
       *         name: slug
       *         required: true
       *         schema: { type: string }
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.get("/slug/:slug", controller.getBySlug);

      /**
       * @swagger
       * /api/flagship-event/versions/{id}:
       *   patch:
       *     summary: Update a version
       *     tags: [FlagshipEventVersions]
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
       *               version_name:
       *                 type: string
       *               slug:
       *                 type: string
       *               version_number:
       *                 type: number
       *               start_date:
       *                 type: string
       *                 format: date
       *               end_date:
       *                 type: string
       *                 format: date
       *               status:
       *                 type: string
       *                 enum:
       *                   - draft
       *                   - active
       *                   - archived
       *               tagline:
       *                 type: string
       *               is_current:
       *                 type: boolean
       *               logo:
       *                 type: string
       *                 format: binary
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.patch("/:id", authenticate, imageUploadHandler({ fieldName: "logo", multiple: false, optional: true }), validateRequestBody(updateFlagshipEventVersionSchema), controller.update);

      /**
       * @swagger
       * /api/flagship-event/versions/{id}:
       *   delete:
       *     summary: Delete a version
       *     tags: [FlagshipEventVersions]
       *     parameters:
       *       - in: path
       *         name: id
       *         required: true
       *         schema: { type: string, format: uuid }
       *     responses:
       *       200:
       *         description: OK
       */
      versionRouter.delete("/:id", authenticate, controller.delete);

      return versionRouter;
};

export default createVersionRouter;

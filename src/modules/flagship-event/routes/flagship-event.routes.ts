import { Router } from "express";
import { FlagshipEventVersionController } from "../controllers/flagship-event.controller";
import { validateRequestBody } from "../../../shared/validators/request.validator";
import { flagshipEventVersionSchema, updateFlagshipEventVersionSchema } from "../validators/flagship-event.validator";

const versionRouter = Router();
const controller = new FlagshipEventVersionController();

/**
 * @swagger
 * /api/flagship-event/versions:
 *   post:
 *     summary: Create a new flagship event version
 *     tags: [FlagshipEventVersions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [version_name, slug, version_number, start_date, end_date]
 *             properties:
 *               version_name: { type: string }
 *               slug: { type: string }
 *               version_number: { type: number }
 *               start_date: { type: string, format: date }
 *               end_date: { type: string, format: date }
 *               status: { type: string, enum: [draft, active, archived] }
 *     responses:
 *       201:
 *         description: Created
 */
versionRouter.post("/", validateRequestBody(flagshipEventVersionSchema), controller.create);

/**
 * @swagger
 * /api/flagship-event/versions:
 *   get:
 *     summary: Get all flagship event versions
 *     tags: [FlagshipEventVersions]
 *     responses:
 *       200:
 *         description: OK
 */
versionRouter.get("/", controller.getAll);

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
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 */
versionRouter.patch("/:id", validateRequestBody(updateFlagshipEventVersionSchema), controller.update);

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
versionRouter.delete("/:id", controller.delete);

export default versionRouter;

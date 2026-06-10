import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';
import { Router } from 'express';
import { DataSource } from 'typeorm';
import { GalleryController } from '../controllers/gallery.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createGallerySchema,
  bulkUpdateGallerySchema,
  galleryQuerySchema,
  galleryVersionParamSchema,
  galleryImageParamSchema,
} from '../validators/gallery.validator';
import { createAuthenticate } from '../../../shared/middlewares/auth.middleware';

const createGalleryRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new GalleryController(dataSource);
  const authenticate = createAuthenticate(dataSource);

  /**
  * @swagger
  * /api/gallery:
  *   post:
  *     summary: Add gallery images to a version (creates the version's gallery if absent, 1-7 total)
  *     tags: [Gallery]
  *     consumes:
  *       - multipart/form-data
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             required:
  *               - flagshipEventVersionId
  *               - image
  *             properties:
  *               flagshipEventVersionId:
  *                 type: string
  *                 format: uuid
  *               link:
  *                 type: string
  *                 format: url
  *               image:
  *                 type: array
  *                 items:
  *                   type: string
  *                   format: binary
  *                 minItems: 1
  *                 maxItems: 7
  *     responses:
  *       201:
  *         description: Created
  *       400:
  *         description: Validation error
  */
  router.post(
    '/',
    authenticate,
    imageUploadHandler({ fieldName: 'image', multiple: true, maxCount: 7 }),
    validateRequestBody(createGallerySchema),
    controller.create
  );

  /**
  * @swagger
  * /api/gallery:
  *   get:
  *     summary: List galleries (one row per version)
  *     tags: [Gallery]
  *     parameters:
  *       - in: query
  *         name: version_id
  *         schema:
  *           type: string
  *           format: uuid
  *       - in: query
  *         name: page
  *         schema:
  *           type: integer
  *           default: 1
  *       - in: query
  *         name: limit
  *         schema:
  *           type: integer
  *           default: 10
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/', validateRequestQuery(galleryQuerySchema), controller.getAll);

  /**
  * @swagger
  * /api/gallery/{version_id}:
  *   get:
  *     summary: Get the gallery (image array) for a version
  *     tags: [Gallery]
  *     parameters:
  *       - in: path
  *         name: version_id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/:version_id', validateRequestParams(galleryVersionParamSchema), controller.getByVersion);

  /**
  * @swagger
  * /api/gallery/{version_id}:
  *   put:
  *     summary: Bulk update the gallery image array for a version
  *     tags: [Gallery]
  *     consumes:
  *       - multipart/form-data
  *     parameters:
  *       - in: path
  *         name: version_id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     requestBody:
  *       required: true
  *       content:
  *         multipart/form-data:
  *           schema:
  *             type: object
  *             properties:
  *               image:
  *                 type: array
  *                 items:
  *                   type: string
  *                   format: binary
  *                 maxItems: 7
  *               data:
  *                 type: string
  *                 description: JSON string of array with {id?, link?} objects
  *     responses:
  *       200:
  *         description: OK
  */
  router.put(
    '/:version_id',
    authenticate,
    imageUploadHandler({ fieldName: 'image', multiple: true, maxCount: 7, optional: true }),
    validateRequestParams(galleryVersionParamSchema),
    validateRequestBody(bulkUpdateGallerySchema),
    controller.bulkUpdate
  );

  /**
  * @swagger
  * /api/gallery/{version_id}/images/{image_id}:
  *   delete:
  *     summary: Delete a single image from a version's gallery
  *     tags: [Gallery]
  *     parameters:
  *       - in: path
  *         name: version_id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *       - in: path
  *         name: image_id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete(
    '/:version_id/images/:image_id',
    authenticate,
    validateRequestParams(galleryImageParamSchema),
    controller.deleteImage
  );

  /**
  * @swagger
  * /api/gallery/{version_id}:
  *   delete:
  *     summary: Delete the entire gallery for a flagship event version
  *     tags: [Gallery]
  *     parameters:
  *       - in: path
  *         name: version_id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/:version_id', authenticate, validateRequestParams(galleryVersionParamSchema), controller.deleteByVersion);

  return router;
};

export default createGalleryRouter;

import { imageUploadHandler } from '../../../shared/utils/helpers/imageUpload.helper';
import { NextFunction, Request, Response, Router } from 'express';
import { DataSource } from 'typeorm';
import { GalleryController } from '../controllers/gallery.controller';
import { validateRequestBody, validateRequestQuery, validateRequestParams } from '../../../shared/validators/request.validator';
import {
  createGallerySchema,
  bulkUpdateGallerySchema,
  galleryQuerySchema,
  galleryIdParamSchema,
  galleryVersionParamSchema,
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
  *     summary: Upload new gallery images (1-7)
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
  *     summary: Get all gallery images
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
  * /api/gallery/{id}:
  *   get:
  *     summary: Get gallery image by ID
  *     tags: [Gallery]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     responses:
  *       200:
  *         description: OK
  */
  router.get('/:id', validateRequestParams(galleryIdParamSchema), controller.getById);

  /**
  * @swagger
  * /api/gallery/{version_id}:
  *   put:
  *     summary: Bulk update gallery images for a version
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
  * /api/gallery/{id}:
  *   delete:
  *     summary: Delete a gallery image
  *     tags: [Gallery]
  *     parameters:
  *       - in: path
  *         name: id
  *         required: true
  *         schema:
  *           type: string
  *           format: uuid
  *     responses:
  *       200:
  *         description: OK
  */
  router.delete('/:id', authenticate, validateRequestParams(galleryIdParamSchema), controller.delete);

  /**
  * @swagger
  * /api/gallery/version/{version_id}:
  *   delete:
  *     summary: Delete all gallery images for a flagship event version
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
  router.delete('/version/:version_id', authenticate, validateRequestParams(galleryVersionParamSchema), controller.deleteByVersion);

  return router;
};

export default createGalleryRouter;


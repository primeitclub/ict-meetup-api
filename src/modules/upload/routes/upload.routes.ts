import { Router } from 'express';
import { createUploadController } from '../controllers/upload.controller';
import { authenticate } from '../../../shared/middlewares/auth.middleware';

const createUploadRouter = () => {
  const router = Router();

  const uploadController = createUploadController();

  /**
   * @swagger
   * /api/upload/{version}/{moduleName}:
   *   post:
   *     summary: Upload a single image
   *     tags: [Upload]
   *     parameters:
   *       - in: path
   *         name: version
   *         required: true
   *         schema:
   *           type: string
   *         example: v7
   *         description: Version identifier (e.g., v7, v1)
   *       - in: path
   *         name: moduleName
   *         required: true
   *         schema:
   *           type: string
   *         example: users
   *         description: Module name (e.g., users, products, profiles)
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               image:
   *                 type: string
   *                 format: binary
   *                 description: Image file to upload
   *     responses:
   *       201:
   *         description: Image uploaded successfully
   *       400:
   *         description: Invalid file or upload error
   *       401:
   *         description: Unauthorized
   */
  router.post('/:version/:moduleName', authenticate, uploadController.uploadSingle);

  /**
   * @swagger
   * /api/upload/{version}/{moduleName}/multiple:
   *   post:
   *     summary: Upload multiple images
   *     tags: [Upload]
   *     parameters:
   *       - in: path
   *         name: version
   *         required: true
   *         schema:
   *           type: string
   *         example: v7
   *         description: Version identifier (e.g., v7, v1)
   *       - in: path
   *         name: moduleName
   *         required: true
   *         schema:
   *           type: string
   *         example: users
   *         description: Module name (e.g., users, products, profiles)
   *       - in: query
   *         name: maxCount
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Maximum number of images to upload
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *                 description: Image files to upload
   *     responses:
   *       201:
   *         description: Images uploaded successfully
   *       400:
   *         description: Invalid file or upload error
   *       401:
   *         description: Unauthorized
   */
  router.post('/:version/:moduleName/multiple', authenticate, uploadController.uploadMultiple);

  return router;
};

const router = createUploadRouter();

export default router;

import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from '../../../shared/config/cloudinary.config';
import { ALLOWED_IMAGE_EXTENSIONS, ALLOWED_IMAGE_MIME_TYPES, MAX_IMAGE_SIZE } from '../../../shared/constants/upload.constants';
import { handleMulterError } from '../../../shared/utils/helpers/multerError.helper';
import { AppError } from '../../../shared/utils/error.utils';
import { FlagshipEventVersionService } from '../../flagship-event/services/flagship-event.service';
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

const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const removeFile = async (filePath?: string) => {
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error(`Failed to remove file ${filePath}:`, err);
  }
};

const createGalleryRouter = (dataSource: DataSource) => {
  const router = Router();
  const controller = new GalleryController(dataSource);
  const authenticate = createAuthenticate(dataSource);
  const flagshipEventVersionService = new FlagshipEventVersionService(dataSource);

  const storage = multer.diskStorage({
    destination: async (req, _file, cb) => {
      try {
        const versionId = req.body.flagshipEventVersionId || req.params.version_id || req.query.versionId;
        if (!versionId) {
          return cb(new AppError('Version ID is required', 400), '');
        }
        const isVersionExist = await flagshipEventVersionService.findById(versionId as string);
        if (!isVersionExist) {
          return cb(new AppError('Version not found', 404), '');
        }

        const uploadDir = path.join(process.cwd(), 'public', 'gallery', String(versionId));
        ensureDirectoryExists(uploadDir);
        cb(null, uploadDir);
      } catch (err) {
        cb(err instanceof Error ? err : new AppError('Failed to resolve upload directory', 500), '');
      }
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${uuidv4()}${ext}`);
    },
  });

  const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
    const extension = path.extname(file.originalname).slice(1).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
      return cb(new AppError('Invalid file extension', 400));
    }
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Invalid MIME type', 400));
    }
    cb(null, true);
  };

  const galleryImageUploadHandler = (options: { fieldName: string; multiple: boolean; maxCount?: number; optional?: boolean }) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const upload = options.multiple
        ? multer({ storage, fileFilter, limits: { fileSize: MAX_IMAGE_SIZE } }).array(options.fieldName, options.maxCount)
        : multer({ storage, fileFilter, limits: { fileSize: MAX_IMAGE_SIZE } }).single(options.fieldName);

      upload(req, res, async (err) => {
        const files: Express.Multer.File[] = options.multiple
          ? (req.files as Express.Multer.File[]) || []
          : req.file
            ? [req.file]
            : [];

        if (err) {
          for (const file of files) {
            await removeFile(file.path);
          }
          return next(handleMulterError(err));
        }

        if (files.length === 0) {
          if (options.optional) return next();
          return next(new AppError(`${options.fieldName} file(s) are required`, 400));
        }

        try {
          const versionId = req.body.flagshipEventVersionId || req.params.version_id || req.query.versionId;
          const uploadedImages: { localPath: string; localUrl: string; cloudUrl: string; publicId: string }[] = [];

          for (const file of files) {
            const cloudResult = await cloudinary.uploader.upload(file.path, {
              folder: `gallery/${versionId}`,
              resource_type: 'image',
            });

            uploadedImages.push({
              localPath: file.path,
              localUrl: `public/gallery/${versionId}/${file.filename}`,
              cloudUrl: cloudResult.secure_url,
              publicId: cloudResult.public_id,
            });
          }

      
          (req.files as any).uploadedImages = uploadedImages;

          next();
        } catch (uploadError) {
          for (const file of files) {
            await removeFile(file.path);
          }
          next(uploadError instanceof Error ? uploadError : new AppError('Unexpected error during image upload', 500));
        }
      });
    };
  };

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
    galleryImageUploadHandler({ fieldName: 'image', multiple: true, maxCount: 7 }),
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
    galleryImageUploadHandler({ fieldName: 'image', multiple: true, maxCount: 7, optional: true }),
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


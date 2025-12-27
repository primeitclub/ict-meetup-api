import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../../config/typeorm/cloudinary.config";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE,
} from "../../constants/upload.constants";
import { handleMulterError } from "./multerErrorHandler";

/* Helpers */
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/* Storage */
const storage = (version: string, moduleName: string) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      const uploadDir = path.join(
        process.cwd(),
        "public",
        "assets",
        version,
        moduleName
      );
      ensureDirectoryExists(uploadDir);
      cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${uuidv4()}${ext}`);
    },
  });

/* File validation */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).slice(1).toLowerCase();

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return cb(new Error("Invalid file extension"));
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid MIME type"));
  }

  cb(null, true);
};

type UploadOptions =
  | { fieldName: string; multiple?: false }
  | { fieldName: string; multiple: true; maxCount: number };

export const imageUploadHandler =
  (version: string, moduleName: string, options: UploadOptions) =>
  (req: Request, res: Response, next: NextFunction) => {
    const upload = options.multiple
      ? multer({
          storage: storage(version, moduleName),
          fileFilter,
          limits: { fileSize: MAX_IMAGE_SIZE },
        }).array(options.fieldName, options.maxCount)
      : multer({
          storage: storage(version, moduleName),
          fileFilter,
          limits: { fileSize: MAX_IMAGE_SIZE },
        }).single(options.fieldName);

    upload(req, res, async (err) => {
      if (err) {
        return next(handleMulterError(err));
      }

      const files: Express.Multer.File[] = options.multiple
        ? ((req.files as Express.Multer.File[]) || [])
        : req.file
        ? [req.file]
        : [];

      if (files.length === 0) {
        return next(new Error(`${options.fieldName} file(s) are required`));
      }

      try {
        const uploadedImages = [];

        for (const file of files) {
          const cloudResult = await cloudinary.uploader.upload(file.path, {
            folder: `assets/${version}/${moduleName}`,
            resource_type: "image",
          });

          uploadedImages.push({
            localPath: file.path,
            localUrl: `/public/assets/${version}/${moduleName}/${file.filename}`,
            cloudUrl: cloudResult.secure_url,
            publicId: cloudResult.public_id,
          });
        }

        req.body.uploadedImages = options.multiple
          ? uploadedImages
          : uploadedImages[0];

        next();
      } catch (error) {
        for (const file of files) {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        }

        next(
          error instanceof Error
            ? error
            : new Error("Unexpected error during image upload")
        );
      }
    });
  };

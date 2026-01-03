import multer from "multer";
import fs from "fs";
import path from "path";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../../config/cloudinary.config";
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE,
} from "../../constants/upload.constants";
import { handleMulterError } from "./multerError.helper";

/* Helper */
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

/* Multer storage configuration */
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

/* Main middleware */
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
        return next(new Error(`${options.fieldName} file(s) are required`));
      }

      try {
        const uploadedImages: {
          localPath: string;
          localUrl: string;
          cloudUrl: string;
          publicId: string;
        }[] = [];

       
        for (const file of files) {
          const cloudResult = await cloudinary.uploader.upload(file.path, {
            folder: `assets/${version}/${moduleName}`,
            resource_type: "image",
          });

          uploadedImages.push({
            localPath: file.path,
            localUrl: `/assets/${version}/${moduleName}/${file.filename}`, 
            cloudUrl: cloudResult.secure_url,
            publicId: cloudResult.public_id,
          });
        }

        req.body.uploadedImages = options.multiple
          ? uploadedImages
          : uploadedImages[0];

        next();
      } catch (uploadError) {

        for (const file of files) {
          await removeFile(file.path);
        }

        next(
          uploadError instanceof Error
            ? uploadError
            : new Error("Unexpected error during image upload")
        );
      }
    });
  };
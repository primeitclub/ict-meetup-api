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
import { AppError } from "../error.utils";
import { FlagshipEventVersionService } from "../../../modules/flagship-event/services/flagship-event.service";
import connectDatabase from "../../config/typeorm/db.config";

const flagshipEventVersionService = new FlagshipEventVersionService(connectDatabase);
/* Helper */
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

export const removeFile = async (filePath?: string) => {
  if (!filePath) return;
  try {
    // Resolve relative URL-style paths (e.g. "/public/assets/...") to absolute disk paths
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    await fs.promises.unlink(resolvedPath);
    console.log(`Successfully removed file: ${resolvedPath}`);
  } catch (err) {
    console.error(`Failed to remove file ${filePath}:`, err);
  }
};

/* Multer storage configuration */
const storage = multer.diskStorage({
  destination: async (req, _file, cb) => {
    try {
      // Determine moduleName from the route (e.g. '/api/team-members' -> 'team-members')
      const moduleName = req.baseUrl.split("/").filter(Boolean).pop() || "unknown-module";

      // Determine versionId from body, query, or params
      const versionId = req.body.versionId || req.query.versionId || req.body.flagshipEventVersionId || req.params.version_id || req.params.versionId;
      if (!versionId) {
        return cb(new AppError("Version ID is required", 400), "");
      }
      const isVersionExist = await flagshipEventVersionService.findById(versionId as string);
      if (!isVersionExist) {
        return cb(new AppError("Version not found", 404), "");
      }

      // Assign to req for use in the loop later
      (req as any).version = isVersionExist.version_name;
      (req as any).moduleName = moduleName;

      const uploadDir = path.join(
        process.cwd(),
        "public",
        "assets",
        String(isVersionExist.version_name),
        String(moduleName)
      );
      ensureDirectoryExists(uploadDir);
      cb(null, uploadDir);
    } catch (err) {
      cb(err instanceof Error ? err : new AppError("Failed to resolve upload directory", 500), "");
    }
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
    return cb(new AppError("Invalid file extension", 400));
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(new AppError("Invalid MIME type", 400));
  }

  cb(null, true);
};


type UploadOptions =
  | { fieldName: string; multiple?: false; optional?: boolean }
  | { fieldName: string; multiple: true; maxCount: number; optional?: boolean };

/* Main middleware */
export const imageUploadHandler =
  (options: UploadOptions) =>
    (req: Request, res: Response, next: NextFunction) => {
      const upload = options.multiple
        ? multer({
          storage: storage,
          fileFilter,
          limits: { fileSize: MAX_IMAGE_SIZE },
        }).array(options.fieldName, options.maxCount)
        : multer({
          storage: storage,
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
          if (options.optional) {
            return next();
          }
          return next(new AppError(`${options.fieldName} file(s) are required`, 400));
        }

        try {
          const uploadedImages: {
            localPath: string;
            localUrl: string;
            cloudUrl: string;
            publicId: string;
          }[] = [];


          for (const file of files) {
            const version = (req as any).version;
            const moduleName = (req as any).moduleName;
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
          // imagePath stores the real disk path so removeFile (fs.unlink) works on failure cleanup
          req.body.imagePath = options.multiple
            ? uploadedImages.map((image) => image.localPath)
            : uploadedImages[0].localPath;
          req.body.imageUrl = options.multiple
            ? uploadedImages.map((image) => image.cloudUrl)
            : uploadedImages[0].cloudUrl;
          req.body.imageLocalUrl = options.multiple
            ? uploadedImages.map((image) => image.localUrl)
            : uploadedImages[0].localUrl;

          next();
        } catch (uploadError) {

          for (const file of files) {
            await removeFile(file.path);
          }

          next(
            uploadError instanceof Error
              ? uploadError
              : new AppError("Unexpected error during image upload", 500)
          );
        }
      });
    };


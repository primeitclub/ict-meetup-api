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
import { handleMulterError } from "../../validators/multerErrorHandler";

/* Helpers */
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/* Multer Storage */
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

/* File Validation */
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  console.log("File received:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
  });

  const extension = path.extname(file.originalname).slice(1).toLowerCase();

  if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension)) {
    return cb(
      new Error("Invalid file extension. Allowed: png, jpg, jpeg, webp")
    );
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error("Invalid MIME type. Only image files are allowed."));
  }

  cb(null, true);
};

export const imageUploadHandler =
  (version: string, moduleName: string) =>
    (req: Request, res: Response, next: NextFunction) => {
      const upload = multer({
        storage: storage(version, moduleName),
        fileFilter,
        limits: { fileSize: MAX_IMAGE_SIZE },
      }).single("image");

      upload(req, res, async (err) => {
        if (err) {
          return next(handleMulterError(err));
        }

        if (!req.file) {
          return next(new Error("Image file is required"));
        }

        const localFilePath = req.file.path;
        const localUrl = `/public/assets/${version}/${moduleName}/${req.file.filename}`;

        try {
          console.log("[UPLOAD] Local file stored successfully:", localFilePath);

          const cloudFolder = `assets/${version}/${moduleName}`;

          const cloudResult = await cloudinary.uploader.upload(localFilePath, {
            folder: cloudFolder,
            resource_type: "image",
          });

          console.log("[UPLOAD] Cloudinary backup successful:", cloudResult.public_id);

          req.body.image = {
            localPath: localFilePath,
            localUrl: localUrl,
            cloudUrl: cloudResult.secure_url,
            publicId: cloudResult.public_id,
          };

          next();
        } catch (error) {
          console.error("[UPLOAD] Unexpected error during upload process:", error);


          try {
            if (fs.existsSync(localFilePath)) {
              fs.unlinkSync(localFilePath);
              console.log("[CLEANUP] Locally stored file deleted due to unexpected error:", localFilePath);
            }
          } catch (cleanupError) {
            console.error("[CLEANUP] Failed to delete local file:", cleanupError);
          }

          req.body.image = {
            localPath: null,
            localUrl: null,
            cloudUrl: null,
            publicId: null,
          };

          return next(error instanceof Error ? error : new Error("Unexpected error occurred during upload"));
        }
      });
    };

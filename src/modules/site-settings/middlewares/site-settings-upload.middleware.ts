import multer from 'multer';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import cloudinary from '../../../shared/config/cloudinary.config';
import { storage, removeFile } from '../../../shared/utils/helpers/imageUpload.helper';
import { handleMulterError } from '../../../shared/utils/helpers/multerError.helper';
import { AppError } from '../../../shared/utils/error.utils';
import { envConfig } from '../../../shared/config/env';
import {
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE,
  ALLOWED_PDF_EXTENSIONS,
  ALLOWED_PDF_MIME_TYPES,
  MAX_PDF_SIZE,
} from '../../../shared/constants/upload.constants';

const QR_CODE_FIELD = 'qrCode';
const PROPOSAL_FIELD = 'proposalPdf';

interface UploadedFile {
  localPath: string;
  localUrl: string;
  cloudUrl: string;
  publicId: string;
}

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).slice(1).toLowerCase();

  if (file.fieldname === QR_CODE_FIELD) {
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(extension) || !ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError('QR code must be a PNG, JPG, or WEBP image', 400));
    }
    return cb(null, true);
  }

  if (file.fieldname === PROPOSAL_FIELD) {
    if (!ALLOWED_PDF_EXTENSIONS.includes(extension) || !ALLOWED_PDF_MIME_TYPES.includes(file.mimetype)) {
      return cb(new AppError('Proposal must be a PDF file', 400));
    }
    return cb(null, true);
  }

  return cb(new AppError('Unexpected file field', 400));
};

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${bytes / (1024 * 1024)}MB` : `${Math.round(bytes / 1024)}KB`;

/**
 * Handles the two independent, optional file fields accepted by
 * `PUT /api/site-settings` in one multipart request: the payment QR code
 * and the sponsorship proposal PDF. Both are uploaded to Cloudinary as
 * `resource_type: "image"` — Cloudinary accounts commonly have delivery of
 * "raw" PDFs disabled as an anti-abuse security setting, so the proposal
 * is stored the same way as the QR code to avoid that restriction.
 */
export const siteSettingsUploadHandler =
  () => (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
      storage,
      fileFilter,
      limits: { fileSize: Math.max(MAX_IMAGE_SIZE, MAX_PDF_SIZE) },
    }).fields([
      { name: QR_CODE_FIELD, maxCount: 1 },
      { name: PROPOSAL_FIELD, maxCount: 1 },
    ]);

    upload(req, res, async (err) => {
      const filesByField = (req.files as { [field: string]: Express.Multer.File[] }) || {};
      const allFiles = Object.values(filesByField).flat();

      if (err) {
        for (const file of allFiles) await removeFile(file.path);
        const sizeLimitMessage =
          err instanceof multer.MulterError && err.field === PROPOSAL_FIELD
            ? `Proposal PDF must not exceed ${formatSize(MAX_PDF_SIZE)}`
            : `QR code image must not exceed ${formatSize(MAX_IMAGE_SIZE)}`;
        return next(handleMulterError(err, sizeLimitMessage));
      }

      if (allFiles.length === 0) {
        return next();
      }

      // multer's `limits.fileSize` applies uniformly to every field in a
      // single `.fields()` call, so it's set to the larger PDF limit above —
      // the QR code image needs its own, tighter check applied manually.
      const qrCodeFile = filesByField[QR_CODE_FIELD]?.[0];
      if (qrCodeFile && qrCodeFile.size > MAX_IMAGE_SIZE) {
        for (const file of allFiles) await removeFile(file.path);
        return next(new AppError(`QR code image must not exceed ${formatSize(MAX_IMAGE_SIZE)}`, 400));
      }

      try {
        const version = (req as any).version;
        const moduleName = (req as any).moduleName;

        // Both fields upload as `resource_type: "image"` — Cloudinary's PDF
        // delivery for "raw" assets is blocked by default on many accounts
        // as an anti-abuse setting, so the proposal PDF avoids that entirely
        // by being stored the same way as the QR code image.
        const uploadFile = async (file: Express.Multer.File): Promise<UploadedFile> => {
          const cloudResult = await cloudinary.uploader.upload(file.path, {
            folder: `assets/${version}/${moduleName}`,
            resource_type: 'image',
          });

          return {
            localPath: file.path,
            localUrl: `${envConfig.BASE_URL}/public/assets/${version}/${moduleName}/${file.filename}`,
            cloudUrl: cloudResult.secure_url,
            publicId: cloudResult.public_id,
          };
        };

        if (qrCodeFile) {
          const uploaded = await uploadFile(qrCodeFile);
          req.body.uploadedImages = uploaded;
          req.body.qrCode = uploaded.localUrl;
        }

        const proposalFile = filesByField[PROPOSAL_FIELD]?.[0];
        if (proposalFile) {
          const uploaded = await uploadFile(proposalFile);
          req.body.uploadedProposal = uploaded;
          req.body.proposalPdf = uploaded.localUrl;
        }

        next();
      } catch (uploadError) {
        for (const file of allFiles) await removeFile(file.path);
        next(
          uploadError instanceof Error
            ? uploadError
            : new AppError('Unexpected error during file upload', 500)
        );
      }
    });
  };

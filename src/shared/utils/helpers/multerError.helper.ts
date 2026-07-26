import { MulterError } from "multer";
import { AppError } from "../error.utils";

export const handleMulterError = (error: unknown, sizeLimitMessage?: string): Error => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new AppError(sizeLimitMessage || "File exceeds the maximum allowed size", 400);
    }
    return new AppError(error.message, 400);
  }

  if (error instanceof Error) {
    return error;
  }

  return new AppError("Unknown error occurred", 500);
};

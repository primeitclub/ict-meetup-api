import { MulterError } from "multer";
import { AppError } from "../error.utils";

export const handleMulterError = (error: unknown): Error => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new AppError("Image size must not exceed 150KB", 400);
    }
    return new AppError(error.message, 400);
  }

  if (error instanceof Error) {
    return error;
  }

  return new AppError("Unknown error occurred", 500);
};

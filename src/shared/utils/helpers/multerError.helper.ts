import { MulterError } from "multer";

export const handleMulterError = (error: unknown): Error => {
  if (error instanceof MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return new Error("Image size must not exceed 150KB");
    }
    return new Error(error.message);
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Unknown error occurred");
};

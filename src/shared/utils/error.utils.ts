import { z } from "zod";
import logger from "./logger.utils";
export class AppError extends Error {
      statusCode: number;
      constructor(message: string, statusCode: number) {
            super(message);
            this.statusCode = statusCode;
            // Only log if this is AppError directly, not a subclass
            if (this.constructor === AppError) {
                  logger.error(message, { module: 'AppError', systemMessage: "Application Error", meta: { statusCode: this.statusCode } });
            }
      }
}
export class ValidationError extends AppError {
      details: z.ZodError[];
      constructor(message: string, details: z.ZodError[]) {
            super(message, 400);
            this.details = details;
            logger.error(message, { module: 'ValidationError', systemMessage: "Validation Error", meta: { details: this.details } });
      }
}
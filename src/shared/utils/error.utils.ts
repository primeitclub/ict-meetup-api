import { z } from "zod";
import logger from "./logger.utils";
export class AppError extends Error {
      statusCode: number;
      constructor(message: string, statusCode: number) {
            super(message);
            this.statusCode = statusCode;
            logger.error(message, { statusCode }, { module: 'AppError' });
      }
}
export class ValidationError extends AppError {
      details: z.ZodError[];
      constructor(message: string, details: z.ZodError[]) {
            super(message, 400);
            this.details = details;
            logger.error(message, { details }, { module: 'ValidationError' });
      }
}
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../utils/error.utils";

// Note: _ is used to indicate that the parameter is intentionally not used in the function body to avoid linting errors
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
      if (err instanceof ValidationError) {
            return res.status(err.statusCode).json({
                  status: 'error',
                  message: err.message,
                  details: err.details,
            });
      }
      return res.status(500).json({
            status: 'error',
            message: 'Internal server error',
      });
};
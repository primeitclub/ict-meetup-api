import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../error.utils";
import { z } from "zod";

// Note: _ is used to indicate that the parameter is intentionally not used in the function body to avoid linting errors
export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      details: err.issues,
    });
  }

  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
      details: err.details,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error("Unhandled Error:", err);
  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};

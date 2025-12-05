import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/error.utils";
export const validateRequestBody = (schema: z.ZodSchema) => {
      return (req: Request, _: Response, next: NextFunction) => {
            try {
                  schema.parse(req.body);
                  next();
            } catch (error) {
                  if (error instanceof z.ZodError) {
                        throw new ValidationError('Invalid request body', (error as any).errors);
                  }
                  next(error);
            }
      };
};

export const validateRequestParams = (schema: z.ZodSchema) => {
      return (req: Request, _: Response, next: NextFunction) => {
            try {
                  schema.parse(req.params);
                  next();
            } catch (error) {
                  if (error instanceof z.ZodError) {
                        throw new ValidationError('Invalid request params', (error as any).errors);
                  }
                  next(error);
            }
      };
};

export const validateRequestQuery = (schema: z.ZodSchema) => {
      return (req: Request, _: Response, next: NextFunction) => {
            try {
                  schema.parse(req.query);
                  next();
            } catch (error) {
                  if (error instanceof z.ZodError) {
                        throw new ValidationError('Invalid request query', (error as any).errors);
                  }
                  next(error);
            }
      };
};
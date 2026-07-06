import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { ValidationError } from "../utils/error.utils";
const zodMessage = (error: z.ZodError): string => {
      const issue = error.issues[0];
      if (!issue) return 'Validation failed';
      const field = issue.path.length > 0 ? issue.path.join('.') : null;
      return field ? `${field}: ${issue.message}` : issue.message;
};

export const validateRequestBody = (schema: z.ZodSchema) => {
      return (req: Request, _: Response, next: NextFunction) => {
            try {
                  const validatedData = schema.parse(req.body);
                  req.body = validatedData;
                  next();
            } catch (error) {
                  if (error instanceof z.ZodError) {
                        throw new ValidationError(zodMessage(error), JSON.parse(JSON.stringify(error.issues)));
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
                        throw new ValidationError(zodMessage(error), JSON.parse(JSON.stringify(error.issues)));
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
                        throw new ValidationError(zodMessage(error), JSON.parse(JSON.stringify(error.issues)));
                  }
                  next(error);
            }
      };
};
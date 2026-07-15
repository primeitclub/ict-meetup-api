import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/utils/error.utils';
import { createAssetLibrarySchema, updateAssetLibrarySchema, assetLibraryIdSchema } from '../dto/asset-library.dto';

export const validateCreateAssetLibrary = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createAssetLibrarySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400);
    }
    next(error);
  }
};

export const validateUpdateAssetLibrary = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateAssetLibrarySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400);
    }
    next(error);
  }
};

export const validateAssetLibraryId = (req: Request, res: Response, next: NextFunction) => {
  try {
    assetLibraryIdSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Invalid asset library ID', 400);
    }
    next(error);
  }
};

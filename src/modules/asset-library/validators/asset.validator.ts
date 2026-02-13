import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from '../../../shared/utils/error.utils';
import { createAssetSchema, updateAssetSchema, assetIdSchema } from '../dto/asset.dto';

export const validateCreateAsset = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = createAssetSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400);
    }
    next(error);
  }
};

export const validateUpdateAsset = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = updateAssetSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Validation failed', 400);
    }
    next(error);
  }
};

export const validateAssetId = (req: Request, res: Response, next: NextFunction) => {
  try {
    assetIdSchema.parse(req.params);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AppError('Invalid asset ID', 400);
    }
    next(error);
  }
};

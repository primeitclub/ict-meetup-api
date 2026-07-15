import { NextFunction, Request, Response } from 'express';
import { AssetLibraryService } from '../services/asset-library.service';
import { CreateAssetLibraryDto, UpdateAssetLibraryDto } from '../dto/asset-library.dto';

export const createAssetLibraryController = (assetLibraryService: AssetLibraryService) => {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const result = await assetLibraryService.create(req.body as CreateAssetLibraryDto, userId);

        return res.status(201).json({
          success: true,
          message: 'Asset library created successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    getAll: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await assetLibraryService.findAll();

        return res.status(200).json({
          success: true,
          message: 'Asset libraries fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const result = await assetLibraryService.findById(req.params.id);

        return res.status(200).json({
          success: true,
          message: 'Asset library fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const result = await assetLibraryService.update(
          req.params.id,
          req.body as UpdateAssetLibraryDto,
          userId
        );

        return res.status(200).json({
          success: true,
          message: 'Asset library updated successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const result = await assetLibraryService.delete(req.params.id, userId);

        return res.status(200).json({
          success: true,
          message: result.message,
        });
      } catch (error) {
        next(error);
      }
    },
  };
};

import { NextFunction, Request, Response } from 'express';
import { AssetService } from '../services/asset.service';
import { CreateAssetDto, UpdateAssetDto } from '../dto/asset.dto';

export const createAssetController = (assetService: AssetService) => {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const { id } = req.params;
        const result = await assetService.create(id, req.body as CreateAssetDto, userId);

        return res.status(201).json({
          success: true,
          message: 'Asset created successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    getAllByLibrary: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;
        const result = await assetService.findAllByLibrary(id);

        return res.status(200).json({
          success: true,
          message: 'Assets fetched successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const result = await assetService.update(
          req.params.assetId,
          req.body as UpdateAssetDto,
          userId
        );

        return res.status(200).json({
          success: true,
          message: 'Asset updated successfully',
          data: result,
        });
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = (req as any).user?.id || 'system';
        const result = await assetService.softDelete(req.params.assetId, userId);

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

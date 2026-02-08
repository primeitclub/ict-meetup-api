import { z } from 'zod';
import { AssetSourceTable } from '../entities/asset-source-table.enum';

export const createAssetLibrarySchema = z.object({
  flagship_event_version_id: z.string().uuid(),
  source_table: z.nativeEnum(AssetSourceTable),
  source_table_id: z.string().uuid(),
  max_image_upload: z.number().min(1),
  extra_options: z.any().optional(),
});

export const updateAssetLibrarySchema = z.object({
  max_image_upload: z.number().min(1).optional(),
  extra_options: z.any().optional(),
});

export const assetLibraryIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateAssetLibraryDto = z.infer<typeof createAssetLibrarySchema>;
export type UpdateAssetLibraryDto = z.infer<typeof updateAssetLibrarySchema>;

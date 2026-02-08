import { z } from 'zod';

export const createAssetSchema = z.object({
  image_path: z.string().optional(),
  image_url: z.string().url().optional(),
  display_order: z.number().min(0),
}).refine(data => data.image_path || data.image_url, {
  message: 'Either image_path or image_url must be provided',
});

export const updateAssetSchema = z.object({
  image_path: z.string().optional(),
  image_url: z.string().url().optional(),
  display_order: z.number().min(0).optional(),
}).refine(data => {
  if (data.image_path === undefined && data.image_url === undefined) return true;
  return data.image_path || data.image_url;
}, {
  message: 'Either image_path or image_url must be provided if updating images',
});

export const assetIdSchema = z.object({
  assetId: z.string().uuid(),
});

export type CreateAssetDto = z.infer<typeof createAssetSchema>;
export type UpdateAssetDto = z.infer<typeof updateAssetSchema>;

export interface AssetResponseDto {
  id: string;
  asset_library_id: string;
  image_path?: string;
  image_url?: string;
  display_order: number;
  createdAt: Date;
  updatedAt: Date;
  deleted_at?: Date;
}

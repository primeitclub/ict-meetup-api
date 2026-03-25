import { z } from 'zod';


export const createGallerySchema = z.object({
  flagshipEventVersionId: z.string().uuid('Invalid flagship event version ID'),
  link: z.string().trim().url().optional().nullable().or(z.literal('').transform(() => null)),
}).passthrough();


export const bulkUpdateGallerySchema = z.object({
  data: z.string().transform((val, ctx) => {
    try {
      const parsed = JSON.parse(val);
      if (!Array.isArray(parsed)) {
        ctx.addIssue({ code: 'custom', message: 'data must be a JSON array' });
        return z.NEVER;
      }
      return parsed as { id?: string; link?: string }[];
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON array in data field' });
      return z.NEVER;
    }
  }),
}).passthrough();


export const galleryQuerySchema = z.object({
  version_id: z.string().uuid('Invalid version ID').optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
});


export const galleryVersionParamSchema = z.object({
  version_id: z.string().uuid(),
});


export const galleryIdParamSchema = z.object({
  id: z.string().uuid(),
});

export type CreateGalleryDto = z.infer<typeof createGallerySchema>;
export type BulkUpdateGalleryDto = z.infer<typeof bulkUpdateGallerySchema>['data'];


import { z } from 'zod';

export const createHeroSectionSchema = z.object({
  flagshipEventVersionId: z.string().uuid(),
  heading: z.string().trim().min(1).max(255),
  paragraph: z.string().trim().min(1).max(1000),
  extraOptions: z.record(z.string(), z.any()).optional(),
});

export const updateHeroSectionSchema = createHeroSectionSchema.partial();

export const heroSectionIdParamSchema = z.object({
  id: z.uuid(),
});

export const heroSectionQuerySchema = z.object({
  flagshipEventVersionId: z.string().uuid().optional(),
});

export type CreateHeroSectionDto = z.infer<typeof createHeroSectionSchema>;
export type UpdateHeroSectionDto = z.infer<typeof updateHeroSectionSchema>;

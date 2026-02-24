import { z } from 'zod';

export const createHeroSectionSchema = z.object({
  flagshipEventVersionId: z.string().uuid(),
  heading: z.string().optional(),
  paragraph: z.string().optional(),
  extraOptions: z.record(z.string(), z.any()).optional(),
});

export const updateHeroSectionSchema = createHeroSectionSchema.partial();

export const heroSectionIdParamSchema = z.object({
  id: z.uuid(),
});

export const heroSectionQuerySchema = z.object({
  flagshipEventVersionId: z.string().uuid().optional(),
});

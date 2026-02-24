import { z } from 'zod';

export const createAboutSectionSchema = z.object({
  flagshipEventVersionId: z.string().uuid(),
  title: z.string().optional(),
  content: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePath: z.string().optional(),
});

export const updateAboutSectionSchema = createAboutSectionSchema.partial();

export const aboutSectionIdParamSchema = z.object({
  id: z.uuid(),
});

export const aboutSectionQuerySchema = z.object({
  flagshipEventVersionId: z.string().uuid().optional(),
});

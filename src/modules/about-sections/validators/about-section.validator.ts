import { z } from 'zod';

export const createAboutSectionSchema = z.object({
  flagshipEventVersionId: z.string().uuid(),
  title: z.string().trim(),
  content: z.string().trim(),
  imageUrl: z.string().trim().optional(),
  imagePath: z.string(),
});

export const updateAboutSectionSchema = createAboutSectionSchema.partial();

export const aboutSectionIdParamSchema = z.object({
  id: z.uuid(),
});

export const aboutSectionQuerySchema = z.object({
  flagshipEventVersionId: z.string().uuid().optional(),
});

export type CreateAboutSectionDto = z.infer<typeof createAboutSectionSchema>;
export type UpdateAboutSectionDto = z.infer<typeof updateAboutSectionSchema>;

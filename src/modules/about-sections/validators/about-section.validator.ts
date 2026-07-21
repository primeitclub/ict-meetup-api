import { z } from 'zod';

export const createAboutSectionSchema = z.object({
  versionId: z.uuid(),
  content: z.string().trim().min(1).max(1000),
  imageUrl: z.string().trim().optional(),
  imagePath: z.string(),
});

export const updateAboutSectionSchema = createAboutSectionSchema.partial();

export const aboutSectionIdParamSchema = z.object({
  id: z.uuid(),
});

export const aboutSectionQuerySchema = z.object({
  versionId: z.string().uuid().optional(),
});

export type CreateAboutSectionDto = z.infer<typeof createAboutSectionSchema>;
export type UpdateAboutSectionDto = z.infer<typeof updateAboutSectionSchema>;

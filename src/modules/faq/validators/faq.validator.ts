import { z } from 'zod';

export const createFaqSchema = z.object({
  flagshipEventVersionId: z.string().uuid(),
  title: z.string().trim().min(1).max(255),
  description: z.string().optional(),
});

export const updateFaqSchema = createFaqSchema.partial();

export const faqIdParamSchema = z.object({
  id: z.uuid(),
});

export const faqQuerySchema = z.object({
  flagshipEventVersionId: z.string().uuid().optional(),
});

export type CreateFaqDto = z.infer<typeof createFaqSchema>;
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;

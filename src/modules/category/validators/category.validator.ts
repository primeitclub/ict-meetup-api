import { z } from 'zod';

export const createCategorySchema = z.object({
  type: z.string(),
  name: z.string().min(1).max(100),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.uuid(),
});

export const categoryQuerySchema = z.object({
  type: z.string().optional(),
});

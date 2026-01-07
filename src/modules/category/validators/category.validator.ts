import { z } from 'zod';
import { CategoryType } from '../entities/category.entity';

export const createCategorySchema = z.object({
  type: z.enum([CategoryType.TEAMS, CategoryType.SPONSORS]),
  name: z.string().min(1).max(100),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const categoryQuerySchema = z.object({
  type: z.enum([CategoryType.TEAMS, CategoryType.SPONSORS]).optional(),
});

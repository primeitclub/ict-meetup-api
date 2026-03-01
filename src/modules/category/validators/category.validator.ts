import { z } from 'zod';
import { paginationShape } from '../../../shared/validators/pagination.validator';
import { CategoryType } from '../entities/category.entity';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  versionId: z.uuid(),
  type: z.nativeEnum(CategoryType).optional(),
  displayOrder: z.preprocess(
    (val) => (typeof val === 'string' ? Number(val) : val),
    z.number().int().min(1).max(15).default(1)
  ),
});

export const updateCategorySchema = createCategorySchema.partial();

export const categoryIdParamSchema = z.object({
  id: z.uuid(),
});

export const categoryQuerySchema = z.object({
  ...paginationShape,
  type: z.nativeEnum(CategoryType).optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
export type CategoryIdParamDto = z.infer<typeof categoryIdParamSchema>;
export type CategoryQueryDto = z.infer<typeof categoryQuerySchema>;

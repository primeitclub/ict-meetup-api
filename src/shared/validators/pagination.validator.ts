import { z } from 'zod';

export const paginationShape = {
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).default(10),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
};

export const paginationSchema = z.object(paginationShape);

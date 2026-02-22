import { z } from 'zod';

export const paginationShape = {
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(10),
      search: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['ASC', 'DESC', 'asc', 'desc']).optional(),
};

export const paginationSchema = z.object(paginationShape);

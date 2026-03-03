import { z } from 'zod';
import { paginationShape } from '../../../shared/validators/pagination.validator';

export const baseSponsorSchema = z.object({
      imagePath: z.string().min(1).max(255),
      name: z.string().min(1).max(150),
      link: z.string().max(255).optional().nullable(),
      categoryId: z.string(),
      versionId: z.string(),
      displayOrder: z.preprocess(
            (val) => (typeof val === 'string' ? Number(val) : val),
            z.number().int().min(0).max(100).default(0)
      ),
      isActive: z.preprocess(
            (val) => {
                  if (typeof val === 'boolean') return val;
                  if (val === 'true' || val === '1' || val === 1) return true;
                  if (val === 'false' || val === '0' || val === 0) return false;
                  return val;
            },
            z.boolean().default(true)
      ),
});

export const createSponsorSchema = baseSponsorSchema;

export const updateSponsorSchema = baseSponsorSchema.partial();

export const sponsorIdParamSchema = z.object({
      id: z.uuid(),
});

export const sponsorQuerySchema = z.object({
      versionId: z.string(),
      ...paginationShape,
      categoryId: z.string().optional(),
});

export const deleteSponsorQuerySchema = z.object({
      versionId: z.string().optional(),
});

export type CreateSponsorDto = z.infer<typeof createSponsorSchema>;
export type UpdateSponsorDto = z.infer<typeof updateSponsorSchema>;
export type SponsorQueryDto = z.infer<typeof sponsorQuerySchema>;

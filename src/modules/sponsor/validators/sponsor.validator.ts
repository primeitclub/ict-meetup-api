import { z } from 'zod';
import { paginationShape } from '../../../shared/validators/pagination.validator';

export const baseSponsorSchema = z.object({
      name: z.string().trim().min(1).max(150),
      link: z.string().max(2048).optional().nullable(),
      categoryId: z.uuid(),
      versionId: z.uuid(),
      imagePath: z.string().min(1).max(2048),
      imageUrl: z.string().optional(),
      displayOrder: z.preprocess(
            (val) => (typeof val === 'string' ? Number(val) : val),
            z.number().int().min(0).max(100).default(0)
      ),
});

export const createSponsorSchema = baseSponsorSchema;

export const updateSponsorSchema = baseSponsorSchema.partial();

export const sponsorIdParamSchema = z.object({
      id: z.uuid(),
});

export const sponsorQuerySchema = z.object({
      versionId: z.uuid(),
      ...paginationShape,
      categoryId: z.uuid().optional(),
});

export const deleteSponsorQuerySchema = z.object({
      versionId: z.uuid().optional(),
});

export type CreateSponsorDto = z.infer<typeof createSponsorSchema>;
export type UpdateSponsorDto = z.infer<typeof updateSponsorSchema>;
export type SponsorQueryDto = z.infer<typeof sponsorQuerySchema>;

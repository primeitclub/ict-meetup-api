import { z } from "zod";
import { paginationShape } from "../../../shared/validators/pagination.validator";

export const createSpeakerSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      imagePath: z.string().min(1, 'Image path is required'),
      designation: z.string().min(1, 'Designation is required'),
      company: z.string().min(1, 'Company is required'),
      versionId: z.uuid().min(1, 'Version ID is required'),
      categoryId: z.uuid().min(1, 'Category ID is required'),
      displayOrder: z.number().min(0, 'Display order must be non-negative'),
      socialLinks: z.object({
            instagram: z.string().optional(),
            linkedin: z.string().optional(),
            portfolio: z.string().optional(),
      }).optional(),
})

export const updateSpeakerSchema = createSpeakerSchema.partial();

export const speakerIdParamSchema = z.object({
      id: z.uuid(),
});

export const speakerQuerySchema = z.object({
      versionId: z.uuid(),
      categoryId: z.uuid(),
      ...paginationShape
});

export type CreateSpeakerDto = z.infer<typeof createSpeakerSchema>;
export type UpdateSpeakerDto = z.infer<typeof updateSpeakerSchema>;
export type SpeakerIdParamDto = z.infer<typeof speakerIdParamSchema>;
export type SpeakerQueryDto = z.infer<typeof speakerQuerySchema>;
import { z } from "zod";
import { paginationShape } from "../../../shared/validators/pagination.validator";

export const createSpeakerSchema = z.object({
      name: z.string().trim().min(1, 'Name is required'),
      designation: z.string().trim().min(1, 'Designation is required'),
      company: z.string().trim().optional(),
      versionId: z.uuid(),
      imagePath: z.string().min(1,'Image path is required'),
      displayOrder: z.preprocess(
            (val) => (val === "" || val === undefined || val === null ? undefined : val),
            z.coerce.number().int().min(1, 'Display order must be positive').optional().default(0)
      ),
      socialLinks: z.preprocess(
            (val) => {
                  if (typeof val === 'string') {
                        try {
                              return JSON.parse(val);
                        } catch {
                              return val;
                        }
                  }
                  return val;
            },
            z.object({
                  instagram: z.url().startsWith('https://', { message: 'Must start with https://' }).optional(),
                  linkedin: z.url().startsWith('https://', { message: 'Must start with https://' }).optional(),
                  portfolio: z.url().startsWith('https://', { message: 'Must start with https://' }).optional(),
            }).optional()
      ),
})

export const updateSpeakerSchema = createSpeakerSchema.partial();

export const speakerIdParamSchema = z.object({
      id: z.uuid(),
});

export const speakerQuerySchema = z.object({
      versionId: z.uuid(),
      ...paginationShape
});

export const deleteSpeakerQuerySchema = z.object({
      versionId: z.uuid(),
});

export type CreateSpeakerDto = z.infer<typeof createSpeakerSchema>;
export type UpdateSpeakerDto = z.infer<typeof updateSpeakerSchema>;
export type SpeakerIdParamDto = z.infer<typeof speakerIdParamSchema>;
export type SpeakerQueryDto = z.infer<typeof speakerQuerySchema>;
import { z } from "zod";
import { paginationShape } from "../../../shared/validators/pagination.validator";

export const createTeamMemberSchema = z.object({
  versionId: z.uuid(),
  categoryId: z.uuid(),
  name: z.string().trim().min(1).max(150),
  designationId: z.uuid(),
  imagePath: z.string(),
  imageUrl: z.string().optional(),
  displayOrder: z.preprocess((val) => {
    if (val === undefined || val === null || val === "") return undefined;
    return typeof val === "string" ? Number(val) : val;
  }, z.number().int().min(1).optional()),
  socialLinks: z.preprocess(
    (val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    },
    z
      .object({
        instagram: z
          .url()
          .startsWith("https://", { message: "Must start with https://" })
          .optional(),
        linkedin: z
          .url()
          .startsWith("https://", { message: "Must start with https://" })
          .optional(),
        portfolio: z
          .url()
          .startsWith("https://", { message: "Must start with https://" })
          .optional(),
      })
      .optional(),
  ),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export const teamMemberIdParamSchema = z.object({
  id: z.uuid(),
});

export const teamMemberQuerySchema = z.object({
  versionId: z.uuid().optional(),
  ...paginationShape,
  categoryId: z.uuid().optional(),
});

//no need for desination creation since its decoupled from version id
export const createTeamMemberDesignationSchema = z.object({
  name: z.string().trim().min(1).max(150),
});

export const updateTeamMemberDesignationSchema =
  createTeamMemberDesignationSchema.partial();

export const teamMemberDesignationIdParamSchema = z.object({
  id: z.uuid(),
});

export const teamMemberDesignationQuerySchema = z.object({
  ...paginationShape,
});

export type CreateTeamMemberDto = z.infer<typeof createTeamMemberSchema>;
export type UpdateTeamMemberDto = z.infer<typeof updateTeamMemberSchema>;

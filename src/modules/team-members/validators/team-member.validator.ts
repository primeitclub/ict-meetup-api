import { z } from 'zod';
import { paginationShape } from '../../../shared/validators/pagination.validator';

export const createTeamMemberSchema = z.object({
  versionId: z.uuid(),
  categoryId: z.uuid(),
  name: z.string().min(1).max(150),
  designation: z.string().max(150).optional(),
  role: z.string().max(100).optional(),
  imagePath: z.string().optional(),
  imageUrl: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  designationOrder: z.number().int().min(1).max(15).default(1),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export const teamMemberIdParamSchema = z.object({
  id: z.uuid(),
});

export const teamMemberQuerySchema = z.object({
  versionId: z.uuid(),
  ...paginationShape
});


export const createTeamCategorySchema = z.object({
  versionId: z.uuid(),
  type: z.string(),
  name: z.string().min(1).max(150),
  displayOrder: z.number().int().min(1).max(15).default(1),
});

export const updateTeamCategorySchema = createTeamCategorySchema.partial();

export const teamCategoryIdParamSchema = z.object({
  id: z.uuid(),
});

export const teamCategoryQuerySchema = z.object({
  type: z.string().optional(),
  ...paginationShape
});

export const createTeamMemberDesignationSchema = z.object({
  versionId: z.uuid(),
  name: z.string().min(1).max(150),
});

export const updateTeamMemberDesignationSchema = createTeamMemberDesignationSchema.partial();

export const teamMemberDesignationIdParamSchema = z.object({
  id: z.uuid(),
});

export const teamMemberDesignationQuerySchema = z.object({
  ...paginationShape
});
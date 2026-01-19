import { z } from 'zod';

export const createTeamMemberSchema = z.object({
  versionId: z.string().uuid(),
  categoryId: z.string().uuid(),
  name: z.string().min(1).max(150),
  designation: z.string().max(150).optional(),
  role: z.string().max(100).optional(),
  imagePath: z.string().optional(),
  imageUrl: z.string().optional(),
  socialLinks: z.record(z.string(), z.string()).optional(),
  displayOrder: z.number().int().min(0).default(0),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

export const teamMemberIdParamSchema = z.object({
  id: z.string().uuid(),
});

export const teamMemberQuerySchema = z.object({
  versionId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
});

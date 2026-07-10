import { z } from 'zod';

const contactPersonSchema = z.object({
  name: z.string(),
  phone: z.string(),
});

const contactDepartmentSchema = z.object({
  department: z.string(),
  contacts: z.array(contactPersonSchema),
});

export const createSettingsSchema = z.object({
  versionId: z.uuid(),
  email: z.string().email().optional(),
  phoneNumber: z.string().trim().max(20).optional(),
  contactDepartments: z.preprocess(
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
    z.array(contactDepartmentSchema).optional()
  ),
});

export const updateSettingsSchema = createSettingsSchema.partial();

export const settingsIdParamSchema = z.object({
  id: z.uuid(),
});

export const settingsQuerySchema = z.object({
  versionId: z.uuid().optional(),
});

export type CreateSettingsDto = z.infer<typeof createSettingsSchema>;
export type UpdateSettingsDto = z.infer<typeof updateSettingsSchema>;

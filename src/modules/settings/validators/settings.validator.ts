import { z } from 'zod';

// Mirrors the client-side rules in
// ict-meetup-admin/src/pages/settings/ContactManagement.tsx — keep in sync.
const phoneSchema = z
  .string()
  .trim()
  .max(20, 'Phone must be at most 20 characters')
  .regex(/^\+?[\d\s()-]+$/, 'Phone can only contain digits, spaces, and + ( ) -')
  .refine((v) => {
    const digits = v.replace(/\D/g, '');
    return digits.length >= 7 && digits.length <= 15;
  }, 'Phone must contain between 7 and 15 digits');

const contactPersonSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters')
    // \p{M} keeps Devanagari combining vowel signs (e.g. "राम") valid.
    .regex(/^[\p{L}\p{M}\s.'-]+$/u, "Name can only contain letters, spaces, and . ' -"),
  phone: phoneSchema,
});

const contactDepartmentSchema = z.object({
  department: z.string(),
  contacts: z.array(contactPersonSchema),
});

export const createSettingsSchema = z.object({
  versionId: z.uuid(),
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

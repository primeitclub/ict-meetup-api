import { z } from 'zod';

export enum SocialMediaPlatform {
  FACEBOOK = 'Facebook',
  INSTAGRAM = 'Instagram',
  LINKEDIN = 'LinkedIn',
  TWITTER = 'Twitter',
  TIKTOK = 'TikTok',
}

const socialMediaLinkSchema = z.object({
  platform: z.nativeEnum(SocialMediaPlatform),
  link: z.string().url(),
});

export const createSettingsSchema = z.object({
  versionId: z.uuid(),
  socialMediaLinks: z.preprocess(
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
    z.array(socialMediaLinkSchema).optional()
  ),
  email: z.string().email().optional(),
  phoneNumber: z.string().trim().max(20).optional(),
  teamName: z.string().trim().max(255).optional(),
  qrCodeUrl: z.string().trim().optional(),
  qrCodePath: z.string().trim().optional(),
  qrCodeLocalPath: z.string().trim().optional(),
  uploadedImages: z.any().optional(),
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

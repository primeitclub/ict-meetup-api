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

export const upsertSiteSettingsSchema = z.object({
  clubEmail: z.string().trim().email().optional().or(z.literal('')),
  clubPhoneNumber: z.string().trim().max(20).optional().or(z.literal('')),
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
  qrCodeUrl: z.string().trim().optional(),
  qrCodePath: z.string().trim().optional(),
  qrCodeLocalPath: z.string().trim().optional(),
  uploadedImages: z.any().optional(),
});

export type UpsertSiteSettingsDto = z.infer<typeof upsertSiteSettingsSchema>;

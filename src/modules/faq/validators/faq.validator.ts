import { z } from 'zod';

export const faqItemSchema = z.object({
  // Present => existing faq to update; absent => new faq to create.
  id: z.string().uuid().optional(),
  title: z.string().trim().min(1).max(255),
  description: z.string().trim().min(1).max(1000),
});

// Create takes a version + an array of faqs (grouped under one version).
export const createFaqSchema = z.object({
  versionId: z.string().uuid(),
  faqs: z.array(faqItemSchema).min(1, 'At least one faq is required'),
});

// Update is also version-based: the submitted array becomes the full set of
// faqs for the version (update existing, insert new, delete the omitted ones).
export const updateFaqSchema = z.object({
  versionId: z.string().uuid(),
  faqs: z.array(faqItemSchema),
});

export const faqIdParamSchema = z.object({
  id: z.uuid(),
});

export const faqQuerySchema = z.object({
  versionId: z.string().uuid().optional(),
});

export type FaqItemDto = z.infer<typeof faqItemSchema>;
export type CreateFaqDto = z.infer<typeof createFaqSchema>;
export type UpdateFaqDto = z.infer<typeof updateFaqSchema>;

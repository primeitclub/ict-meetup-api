import { z } from "zod";
import { EventRegistrationStatus } from "../entities/event-registration.entity";

const createEventRegistrationBaseSchema = z.object({
      username: z.string().trim().min(3).max(150),
      email: z.email().trim(),
      contactNumber: z.string().trim().min(10).max(15),
      isStudent: z.preprocess((val) => val === 'true' || val === true, z.boolean()),
      educationLevel: z.string().trim().min(3).max(150).optional(),
      faculty: z.string().trim().min(3).max(150).optional(),
      year: z.coerce.number().optional(),
      attachedPaymentScreenshot: z.string().trim().min(3).max(150),
      eventId: z.string().trim().min(3).max(150),
      versionId: z.string().trim().min(3).max(150),
      status: z.enum(EventRegistrationStatus).default(EventRegistrationStatus.PENDING),
});

export const createEventRegistrationSchema = createEventRegistrationBaseSchema.superRefine((data, ctx) => {
      if (data.isStudent) {
            if (!data.educationLevel) {
                  ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Education level is required for students",
                        path: ["educationLevel"],
                  });
            }
            if (!data.faculty) {
                  ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Faculty is required for students",
                        path: ["faculty"],
                  });
            }
            if (data.year === undefined || data.year === null) {
                  ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Year is required for students",
                        path: ["year"],
                  });
            }
      }
});

export const updateEventRegistrationSchema = createEventRegistrationBaseSchema.partial();


export const eventRegistrationQuerySchema = z.object({
      eventId: z.string().trim().min(3).max(150),
})

export const eventRegistrationIdParamSchema = z.object({
      id: z.string().trim().min(3).max(150),
})

export type CreateEventRegistrationDto = z.infer<typeof createEventRegistrationSchema>;
export type UpdateEventRegistrationDto = z.infer<typeof updateEventRegistrationSchema>;
export type EventRegistrationQueryDto = z.infer<typeof eventRegistrationQuerySchema>;
export type EventRegistrationIdParamDto = z.infer<typeof eventRegistrationIdParamSchema>;

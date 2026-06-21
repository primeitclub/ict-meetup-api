import { z } from "zod";
import { EventStatus, FeeType } from "../entities/event.entity";
import { paginationShape } from "../../../shared/validators/pagination.validator";

export const baseEventSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(150),
  description: z.string().min(1).max(10000),
  imagePath: z.string().optional(),
  imageUrl: z.string().optional(),
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  categoryId: z.string(),
  versionId: z.string(),
  speakerId: z.preprocess((v) => (v === "" ? undefined : v), z.string().optional()),
  totalSeats: z.coerce.number().min(1).max(100),
  feeType: z.enum([FeeType.FREE, FeeType.PAID]),
  fee: z.string().optional().nullable(),
  location: z.string().trim().min(1).max(255),
  status: z.enum([
    EventStatus.DRAFT,
    EventStatus.PUBLISHED,
    EventStatus.ARCHIVED,
  ]),
  registrationDeadline: z.coerce.date(),
  displayOrder: z.preprocess(
    (val) => (typeof val === "string" ? Number(val) : val),
    z.number().int().min(1),
  ),
});

export const createEventSchema = baseEventSchema.superRefine((data, ctx) => {
  // 1. Time Range Validation
  if (data.startTime && data.endTime) {
    const [sHours, sMinutes] = data.startTime.split(":").map(Number);
    const [eHours, eMinutes] = data.endTime.split(":").map(Number);
    const startTotal = sHours * 60 + sMinutes;
    const endTotal = eHours * 60 + eMinutes;

    if (startTotal >= endTotal) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Start time must be before end time",
        path: ["startTime"],
      });
    }
  }

  // 2. Fee Validation
  if (
    data.feeType === FeeType.FREE &&
    data.fee &&
    String(data.fee).trim() !== ""
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Free events cannot have a fee",
      path: ["fee"],
    });
  }
  if (
    data.feeType === FeeType.PAID &&
    (!data.fee || String(data.fee).trim() === "")
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Paid events must have a fee",
      path: ["fee"],
    });
  }

  // 3. Registration Deadline Validation
  if (data.date && data.registrationDeadline) {
    const eventDate = new Date(data.date);
    if (data.registrationDeadline >= eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Registration deadline must be before the event date",
        path: ["registrationDeadline"],
      });
    }
  }
});

export const updateEventSchema = baseEventSchema
  .partial()
  .superRefine((data, ctx) => {
    // 1. Time Range Validation
    if (data.startTime && data.endTime) {
      const [sHours, sMinutes] = data.startTime.split(":").map(Number);
      const [eHours, eMinutes] = data.endTime.split(":").map(Number);
      const startTotal = sHours * 60 + sMinutes;
      const endTotal = eHours * 60 + eMinutes;

      if (startTotal >= endTotal) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start time must be before end time",
          path: ["startTime"],
        });
      }
    }

    // 2. Fee Validation
    if (
      data.feeType === FeeType.FREE &&
      data.fee &&
      String(data.fee).trim() !== ""
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Free events cannot have a fee",
        path: ["fee"],
      });
    }
    if (
      data.feeType === FeeType.PAID &&
      data.fee !== undefined &&
      (!data.fee || String(data.fee).trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Paid events must have a fee",
        path: ["fee"],
      });
    }

    // 3. Registration Deadline Validation
    if (data.date && data.registrationDeadline) {
      const eventDate = new Date(data.date);
      if (data.registrationDeadline >= eventDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration deadline must be before the event date",
          path: ["registrationDeadline"],
        });
      }
    }
  });

export const eventIdParamSchema = z.object({
  id: z.uuid(),
});

export const eventQuerySchema = z.object({
  versionId: z.string().optional(),
  categoryId: z.string().optional(),
  ...paginationShape,
});

export const deleteEventQuerySchema = z.object({
  versionId: z.uuid(),
});

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
export type EventQueryDto = z.infer<typeof eventQuerySchema>;

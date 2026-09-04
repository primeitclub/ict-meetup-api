import { z } from "zod";
import { EventStatus, FeeType, EventType } from "../entities/event.entity";
import { paginationShape } from "../../../shared/validators/pagination.validator";

export const baseEventSchema = z.object({
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(150),
  description: z.string().min(1).max(10000),
  imagePath: z.string().optional(),
  imageUrl: z.string().optional(),
  startTime: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)")
      .optional()
  ),
  endTime: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : val),
    z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)")
      .optional()
  ),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  categoryId: z.string(),
  versionId: z.string(),
  // Multipart sends a single value as a bare string and multiple as an array, so
  // normalise both to string[]. Absent/"" means "no speakers", not "leave unchanged".
  speakerIds: z.preprocess((v) => {
    if (v === "" || v === undefined || v === null) return [];
    if (typeof v === "string") return [v];
    return v;
  }, z.array(z.string().min(1)).default([])),
  // Optional — "" or null means "clear it" (unlimited seats, no capacity check on
  // registration approval); the admin form always sends this field so it can be
  // unset, same convention as registerLink below. A genuinely absent key (undefined)
  // means "leave unchanged" on partial updates.
  totalSeats: z.preprocess(
    (val) => (val === "" || val === null ? null : val === undefined ? undefined : Number(val)),
    z.number().int().min(1).max(100).nullable().optional()
  ),
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
  isHighlighted: z
    .preprocess((v) => v === "true" || v === true, z.boolean())
    .optional(),
  eventType: z.enum([EventType.SINGLE, EventType.GROUP]).optional().default(EventType.SINGLE),
  minParticipants: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().int().min(1).max(20).optional()
  ),
  maxParticipants: z.preprocess(
    (val) => (val === "" || val === undefined || val === null ? undefined : Number(val)),
    z.number().int().min(1).max(20).optional()
  ),
  // Optional external registration URL (e.g. a Google Form). When set it takes
  // precedence over the in-app registration flow. "" means "clear it" — the
  // admin form always sends this field so it can be unset.
  registerLink: z.preprocess(
    (val) => (typeof val === "string" && val.trim() === "" ? null : val),
    z
      .string()
      .trim()
      .max(500, "Register link must be at most 500 characters")
      // Restricted to http(s) so the stored value can never be a
      // javascript:/data: URI, which the client turns into a redirect.
      .regex(
        /^https?:\/\/.+/i,
        "Register link must start with http:// or https://",
      )
      .nullable()
      .optional(),
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
    if (data.registrationDeadline > eventDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Registration deadline cannot be after the event date",
        path: ["registrationDeadline"],
      });
    }
  }

  // 4. Group Event Validation
  if (data.eventType === EventType.GROUP) {
    if (data.maxParticipants === undefined || data.maxParticipants === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum participants limit is required for group events",
        path: ["maxParticipants"],
      });
    } else if (data.maxParticipants < 1 || data.maxParticipants > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum participants must be between 1 and 20",
        path: ["maxParticipants"],
      });
    }

    if (data.minParticipants === undefined || data.minParticipants === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum participants limit is required for group events",
        path: ["minParticipants"],
      });
    } else {
      if (data.minParticipants < 1 || data.minParticipants > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum participants must be between 1 and 20",
          path: ["minParticipants"],
        });
      }
      if (data.maxParticipants !== undefined && data.maxParticipants !== null && data.minParticipants > data.maxParticipants) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum participants cannot be greater than maximum participants",
          path: ["minParticipants"],
        });
      }
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
      if (data.registrationDeadline > eventDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Registration deadline cannot be after the event date",
          path: ["registrationDeadline"],
        });
      }
    }

    // 4. Group Event Validation
    if (data.eventType === EventType.GROUP) {
      if (data.maxParticipants === undefined || data.maxParticipants === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum participants limit is required for group events",
          path: ["maxParticipants"],
        });
      } else if (data.maxParticipants < 1 || data.maxParticipants > 20) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Maximum participants must be between 1 and 20",
          path: ["maxParticipants"],
        });
      }

      if (data.minParticipants === undefined || data.minParticipants === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Minimum participants limit is required for group events",
          path: ["minParticipants"],
        });
      } else {
        if (data.minParticipants < 1 || data.minParticipants > 20) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum participants must be between 1 and 20",
            path: ["minParticipants"],
          });
        }
        if (data.maxParticipants !== undefined && data.maxParticipants !== null && data.minParticipants > data.maxParticipants) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Minimum participants cannot be greater than maximum participants",
            path: ["minParticipants"],
          });
        }
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

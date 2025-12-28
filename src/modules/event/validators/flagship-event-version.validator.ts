import { z } from "zod";
import { EventVersionStatus } from "../entities/event.entity";

export const flagshipEventVersionSchema = z
  .object({
    version_name: z.string().min(1).max(50),
    slug: z
      .string()
      .min(1)
      .max(50)
      .regex(/^[a-z0-9-]+$/, "Slug must be alphanumeric with hyphens"),
    version_number: z.number().min(0).max(99),
    status: z.nativeEnum(EventVersionStatus).default(EventVersionStatus.DRAFT),
    start_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid start_date format",
      })
      .transform((val) => new Date(val)),
    end_date: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid end_date format",
      })
      .transform((val) => new Date(val)),
    is_current: z.boolean().default(false),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: "start_date must be before end_date",
    path: ["start_date"],
  });

export const updateFlagshipEventVersionSchema =
  flagshipEventVersionSchema.partial();

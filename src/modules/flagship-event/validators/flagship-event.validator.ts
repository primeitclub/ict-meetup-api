import { z } from "zod";
import { EventVersionStatus } from "../entities/flagship-event.entity";
import { paginationShape } from "../../../shared/validators/pagination.validator";

const baseFlagshipEventVersionSchema = z.object({
  version_name: z.string().min(1).max(50),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug must be alphanumeric with hyphens"),
  version_number: z.number().min(0).max(99),
  status: z.enum(EventVersionStatus).default(EventVersionStatus.DRAFT),
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
});
export const flagshipEventVersionSchema = baseFlagshipEventVersionSchema.refine(
  (data) => data.start_date < data.end_date,
  {
    message: "start_date must be before end_date",
    path: ["start_date"],
  }
);
// IMPORTANT NOTE:  always use partil() before refine() , if not it will cause the build error

export const updateFlagshipEventVersionSchema = baseFlagshipEventVersionSchema
  .partial()
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.start_date < data.end_date;
      }
      return true;
    },
    {
      message: "start_date must be before end_date",
      path: ["start_date"],
    }
  );

export const flagshipEventQuerySchema = z.object({
  ...paginationShape
});

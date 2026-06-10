import { z } from "zod";
import { paginationShape } from "../../../shared/validators/pagination.validator";

// Enums must match entity exactly
const EventVersionStatusValues = ["draft", "active", "archived"] as const;
type EventVersionStatus = typeof EventVersionStatusValues[number];

const baseFlagshipEventVersionSchema = z.object({
  version_name: z.string().trim().min(1, "Version name is required").max(50, "Version name too long"),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(50, "Slug too long")
    .regex(/^[a-z0-9-]+$/i, "Slug must contain only alphanumeric characters and hyphens"),
  // z.coerce.number() handles string/number from multipart/form-data
  version_number: z.coerce.number().min(0).max(99.9, "Version number must be between 0.0 and 99.9"),
  status: z.enum(EventVersionStatusValues).default("draft"),
  // Date strings from form-data, transform to Date
  start_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid start date format (use YYYY-MM-DD)")
    .transform((val) => new Date(val)),
  end_date: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), "Invalid end date format (use YYYY-MM-DD)")
    .transform((val) => new Date(val)),
  is_current: z
    .union([
      z.boolean(),
      z.enum(["true", "false"]).transform((v) => v === "true"),
    ])
    .default(false),
  logo: z.string().min(1, "Logo is required"),
});

export const flagshipEventVersionSchema = baseFlagshipEventVersionSchema.refine(
  (data) => data.start_date < data.end_date,
  {
    message: "Start date must be before end date",
    path: ["end_date"],
  }
);

export const updateFlagshipEventVersionSchema = baseFlagshipEventVersionSchema
  .partial() // All fields optional for updates
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.start_date < data.end_date;
      }
      return true;
    },
    {
      message: "Start date must be before end date when both provided",
      path: ["end_date"],
    }
  );

export const flagshipEventQuerySchema = z.object({
  ...paginationShape,
  search: z.string().optional(),
  sortBy: z.enum(["version_name", "version_number", "status", "createdAt"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
}).transform((val) => val);

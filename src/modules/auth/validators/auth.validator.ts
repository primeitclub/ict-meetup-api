import { z } from "zod";
export const loginSchema = z.object({
      email: z.email({ message: "Invalid email address" }).min(1).max(255),
      password: z.string().min(1).max(255),
      ipAddress: z.string().min(1).max(255).optional().default('unknown'),
      userAgent: z.string().min(1).max(255).optional().default('unknown'),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type LoginDto = LoginSchema;

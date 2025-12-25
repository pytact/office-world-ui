// User Activation Form Schema
// Zod validation schema for user activation form
// Following R10 rules

import { z } from "zod";

/**
 * User Activation Form Schema
 * POST /v1/auth/activation/{token}
 */
export const ActivationSchema = z
  .object({
    first_name: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name must be 50 characters or less")
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        "First name can only contain alphanumeric characters and spaces"
      ),
    last_name: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name must be 50 characters or less")
      .regex(
        /^[a-zA-Z0-9\s]+$/,
        "Last name can only contain alphanumeric characters and spaces"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be 128 characters or less")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
      ),
    password_confirm: z.string().min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: "Passwords do not match",
    path: ["password_confirm"],
  });

export type ActivationFormSchema = z.infer<typeof ActivationSchema>;


// Password Reset Form Schemas
// Zod validation schemas for password reset forms
// Following R10 rules

import { z } from "zod";

/**
 * Password Reset Request Form Schema
 * POST /v1/auth/password-reset/request
 */
export const PasswordResetRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(254, "Email address is too long"),
});

export type PasswordResetRequestFormSchema = z.infer<typeof PasswordResetRequestSchema>;

/**
 * Password Reset Submit Form Schema
 * POST /v1/auth/password-reset/{token}
 */
export const PasswordResetSubmitSchema = z
  .object({
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

export type PasswordResetSubmitFormSchema = z.infer<typeof PasswordResetSubmitSchema>;


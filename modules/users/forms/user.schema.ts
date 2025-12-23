// User Form Schemas
// Zod validation schemas for user forms
// Following R10 rules

import { z } from "zod";

/**
 * User Invitation Form Schema
 * POST /api/v1/users/invite
 */
export const UserInviteSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less"),
  role_code: z
    .string()
    .min(1, "Role is required")
    .refine(
      (val) => ["ceo", "hr", "manager", "employee"].includes(val),
      "Invalid role selected"
    ),
  company_slug: z
    .union([z.string().min(1), z.literal(""), z.null()])
    .optional()
    .transform((val) => (val === "" || val === null || val === undefined ? null : val)),
});

export type UserInviteFormSchema = z.infer<typeof UserInviteSchema>;

/**
 * User Role Change Form Schema
 * PATCH /api/v1/users/{id}/role
 */
export const UserRoleChangeSchema = z.object({
  role_code: z
    .string()
    .min(1, "Role is required")
    .refine(
      (val) => ["ceo", "hr", "manager", "employee"].includes(val),
      "Invalid role selected"
    ),
});

export type UserRoleChangeFormSchema = z.infer<typeof UserRoleChangeSchema>;

/**
 * User Update Form Schema
 * PATCH /api/v1/users/{user_id}
 * At least one field (first_name or last_name) must be provided
 */
export const UserUpdateSchema = z
  .object({
    first_name: z
      .union([
        z.string().min(1, "First name must be at least 1 character").max(255, "First name must be 255 characters or less").regex(
          /^[a-zA-Z0-9\s]+$/,
          "First name can only contain alphanumeric characters and spaces"
        ),
        z.null(),
        z.literal(""),
      ])
      .optional()
      .transform((val) => (val === "" ? null : val)),
    last_name: z
      .union([
        z.string().min(1, "Last name must be at least 1 character").max(255, "Last name must be 255 characters or less").regex(
          /^[a-zA-Z0-9\s]+$/,
          "Last name can only contain alphanumeric characters and spaces"
        ),
        z.null(),
        z.literal(""),
      ])
      .optional()
      .transform((val) => (val === "" ? null : val)),
  })
  .refine(
    (data) => {
      const firstName = data.first_name && typeof data.first_name === "string" ? data.first_name.trim() : null;
      const lastName = data.last_name && typeof data.last_name === "string" ? data.last_name.trim() : null;
      return firstName || lastName;
    },
    {
      message: "At least one field (first_name or last_name) must be provided",
      path: ["root"],
    }
  );

export type UserUpdateFormSchema = z.infer<typeof UserUpdateSchema>;


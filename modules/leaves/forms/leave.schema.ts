// Leave Form Schemas
// Zod validation schemas for leave forms
// Following R10 rules and F-009 API spec

import { z } from "zod";

/**
 * Leave Create Form Schema
 * POST /api/v1/company/leaves
 * Following F-009 API spec validation rules:
 * - leave_type: required, enum ["CASUAL", "SICK", "PAID", "UNPAID"]
 * - start_date: required, ISO 8601 date format (YYYY-MM-DD)
 * - end_date: required, ISO 8601 date format (YYYY-MM-DD), must be >= start_date
 * - day_type: required, enum ["FULL_DAY", "FIRST_HALF", "SECOND_HALF"]
 * - reason: required, 10-500 characters
 * - manager_approver_id: required, UUID format
 * - hr_approver_id: required, UUID format
 */
export const LeaveCreateSchema = z
  .object({
    leave_type: z.enum(["CASUAL", "SICK", "PAID", "UNPAID"], {
      required_error: "Leave type is required",
    }),
    start_date: z
      .string()
      .trim()
      .min(1, "Start date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    end_date: z
      .string()
      .trim()
      .min(1, "End date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format"),
    day_type: z.enum(["FULL_DAY", "FIRST_HALF", "SECOND_HALF"], {
      required_error: "Day type is required",
    }),
    reason: z
      .string()
      .trim()
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason must be 500 characters or less"),
    manager_approver_id: z
      .string()
      .uuid("Manager approver ID must be a valid UUID")
      .min(1, "Manager approver is required"),
    hr_approver_id: z
      .string()
      .uuid("HR approver ID must be a valid UUID")
      .min(1, "HR approver is required"),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return start <= end;
    },
    {
      message: "End date must be greater than or equal to start date",
      path: ["end_date"],
    }
  );

export type LeaveCreateFormSchema = z.infer<typeof LeaveCreateSchema>;

/**
 * Leave Rejection Form Schema
 * For rejection modal: requires rejection reason
 * - rejection_reason: required, 10-500 characters
 */
export const LeaveRejectionSchema = z.object({
  rejection_reason: z
    .string()
    .trim()
    .min(10, "Rejection reason must be at least 10 characters")
    .max(500, "Rejection reason must be 500 characters or less"),
});

export type LeaveRejectionFormSchema = z.infer<typeof LeaveRejectionSchema>;


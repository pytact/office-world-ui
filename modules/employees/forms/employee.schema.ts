// Employee Form Schemas
// Zod validation schemas for employee forms
// Following R10 rules

import { z } from "zod";
import {
  EmploymentStatus,
  EmploymentType,
  EmploymentLevel,
  Department,
  Gender,
  MaritalStatus,
  BloodGroup,
  DocumentType,
} from "@/utils/types/requests/employee";

/**
 * Employee Create Form Schema
 * POST /api/v1/company/employees
 */
export const EmployeeCreateSchema = z
  .object({
    user_id: z.string().uuid("Invalid user ID"),
    joining_date: z
      .string()
      .min(1, "Joining date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .refine(
        (date) => {
          const dateObj = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dateObj <= today;
        },
        {
          message: "Joining date cannot be in the future",
        }
      ),
    employment_status: z.enum([
      "TRAINEE",
      "PROBATION",
      "CONFIRMED",
      "NOTICE_PERIOD",
      "ACTIVE",
      "ON_HOLD",
      "TERMINATED",
      "RESIGNED",
    ] as const),
    job_title: z.string().max(255, "Job title must be 255 characters or less").nullable().optional(),
    department: z
      .enum([
        "FRONTEND",
        "BACKEND",
        "FULLSTACK",
        "QA",
        "HR",
        "DEVOPS",
        "UIUX",
        "PRODUCT",
        "MARKETING",
        "DATA",
        "SUPPORT",
      ] as const)
      .nullable()
      .optional(),
    employment_type: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "TEMPORARY"] as const)
      .nullable()
      .optional(),
    employment_level: z
      .enum(["INTERN", "JUNIOR", "MID", "SENIOR", "LEAD", "MANAGER"] as const)
      .nullable()
      .optional(),
    work_email: z
      .string()
      .email("Invalid email format")
      .max(254, "Email must be 254 characters or less")
      .nullable()
      .optional(),
    gender: z.enum(["MALE", "FEMALE", "OTHER"] as const).nullable().optional(),
    marital_status: z
      .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"] as const)
      .nullable()
      .optional(),
    blood_group: z
      .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const)
      .nullable()
      .optional(),
    nationality: z.string().max(100, "Nationality must be 100 characters or less").nullable().optional(),
    address: z.string().max(500, "Address must be 500 characters or less").nullable().optional(),
    city: z.string().max(100, "City must be 100 characters or less").nullable().optional(),
    state: z.string().max(100, "State must be 100 characters or less").nullable().optional(),
    country: z.string().max(100, "Country must be 100 characters or less").nullable().optional(),
    document_type: z
      .enum(["AADHAAR", "PAN", "DL", "VOTER_ID", "PASSPORT"] as const)
      .nullable()
      .optional(),
    document_number: z
      .string()
      .max(50, "Document number must be 50 characters or less")
      .nullable()
      .optional(),
    separation_initiated_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .nullable()
      .optional(),
    separation_reason: z.string().max(500, "Separation reason must be 500 characters or less").nullable().optional(),
    last_working_day: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .nullable()
      .optional(),
    notice_period_days: z
      .number()
      .int("Notice period days must be an integer")
      .min(0, "Notice period days cannot be negative")
      .max(365, "Notice period days cannot exceed 365")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      // If employment_status is RESIGNED or TERMINATED, separation fields should be provided
      if (data.employment_status === "RESIGNED" || data.employment_status === "TERMINATED") {
        return !!data.separation_initiated_date && !!data.separation_reason;
      }
      return true;
    },
    {
      message: "Separation initiated date and separation reason are required when status is RESIGNED or TERMINATED",
      path: ["separation_initiated_date"],
    }
  )
  .refine(
    (data) => {
      // If employment_status is RESIGNED or TERMINATED, separation_reason must be provided
      if (data.employment_status === "RESIGNED" || data.employment_status === "TERMINATED") {
        return !!data.separation_reason;
      }
      return true;
    },
    {
      message: "Separation reason is required when status is RESIGNED or TERMINATED",
      path: ["separation_reason"],
    }
  );

export type EmployeeCreateFormSchema = z.infer<typeof EmployeeCreateSchema>;

/**
 * Employee Update Form Schema
 * PATCH /api/v1/company/employees/{employee_id}
 * All fields optional for partial update
 */
export const EmployeeUpdateSchema = z.object({
  employment_status: z
    .enum([
      "TRAINEE",
      "PROBATION",
      "CONFIRMED",
      "NOTICE_PERIOD",
      "ACTIVE",
      "ON_HOLD",
      "TERMINATED",
      "RESIGNED",
    ] as const)
    .nullable()
    .optional(),
  job_title: z.string().max(255, "Job title must be 255 characters or less").nullable().optional(),
  department: z
    .enum([
      "FRONTEND",
      "BACKEND",
      "FULLSTACK",
      "QA",
      "HR",
      "DEVOPS",
      "UIUX",
      "PRODUCT",
      "MARKETING",
      "DATA",
      "SUPPORT",
    ] as const)
    .nullable()
    .optional(),
  employment_type: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "FREELANCE", "TEMPORARY"] as const)
    .nullable()
    .optional(),
  employment_level: z
    .enum(["INTERN", "JUNIOR", "MID", "SENIOR", "LEAD", "MANAGER"] as const)
    .nullable()
    .optional(),
  work_email: z
    .string()
    .email("Invalid email format")
    .max(254, "Email must be 254 characters or less")
    .nullable()
    .optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"] as const).nullable().optional(),
  marital_status: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED", "SEPARATED"] as const)
    .nullable()
    .optional(),
  blood_group: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const)
    .nullable()
    .optional(),
  nationality: z.string().max(100, "Nationality must be 100 characters or less").nullable().optional(),
  address: z.string().max(500, "Address must be 500 characters or less").nullable().optional(),
  city: z.string().max(100, "City must be 100 characters or less").nullable().optional(),
  state: z.string().max(100, "State must be 100 characters or less").nullable().optional(),
  country: z.string().max(100, "Country must be 100 characters or less").nullable().optional(),
  document_type: z
    .enum(["AADHAAR", "PAN", "DL", "VOTER_ID", "PASSPORT"] as const)
    .nullable()
    .optional(),
  document_number: z
    .string()
    .max(50, "Document number must be 50 characters or less")
    .nullable()
    .optional(),
  separation_initiated_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  separation_reason: z.string().max(500, "Separation reason must be 500 characters or less").nullable().optional(),
  last_working_day: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .nullable()
    .optional(),
  notice_period_days: z
    .number()
    .int("Notice period days must be an integer")
    .min(0, "Notice period days cannot be negative")
    .max(365, "Notice period days cannot exceed 365")
    .nullable()
    .optional(),
  is_active: z.boolean().nullable().optional(),
})
  .refine(
    (data) => {
      // If employment_status is RESIGNED or TERMINATED, separation fields should be provided
      if (data.employment_status === "RESIGNED" || data.employment_status === "TERMINATED") {
        return !!data.separation_initiated_date && !!data.separation_reason;
      }
      return true;
    },
    {
      message: "Separation initiated date and separation reason are required when status is RESIGNED or TERMINATED",
      path: ["separation_initiated_date"],
    }
  )
  .refine(
    (data) => {
      // If employment_status is RESIGNED or TERMINATED, separation_reason must be provided
      if (data.employment_status === "RESIGNED" || data.employment_status === "TERMINATED") {
        return !!data.separation_reason;
      }
      return true;
    },
    {
      message: "Separation reason is required when status is RESIGNED or TERMINATED",
      path: ["separation_reason"],
    }
  );

export type EmployeeUpdateFormSchema = z.infer<typeof EmployeeUpdateSchema>;


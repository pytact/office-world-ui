// Project Form Schemas
// Zod validation schemas for project forms
// Following R10 rules

import { z } from "zod";

/**
 * Project Create Form Schema
 * POST /api/v1/company/projects
 * Following F-007 API spec validation rules
 */
export const ProjectCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(255, "Project name must be 255 characters or less"),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED"], {
    errorMap: () => ({ message: "Status must be ACTIVE, INACTIVE, or COMPLETED" }),
  }),
});

export type ProjectCreateFormSchema = z.infer<typeof ProjectCreateSchema>;

/**
 * Project Update Form Schema
 * PATCH /api/v1/company/projects/{project_id}
 * For edit form: both fields are required (not optional)
 */
export const ProjectUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Project name is required")
    .max(255, "Project name must be 255 characters or less")
    .nullable(),
  status: z
    .enum(["ACTIVE", "INACTIVE", "COMPLETED"], {
      errorMap: () => ({ message: "Status must be ACTIVE, INACTIVE, or COMPLETED" }),
    })
    .nullable(),
});

export type ProjectUpdateFormSchema = z.infer<typeof ProjectUpdateSchema>;


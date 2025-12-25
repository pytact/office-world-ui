// Task Form Schemas
// Zod validation schemas for task forms
// Following R10 rules

import { z } from "zod";

/**
 * Task Create Form Schema
 * POST /api/v1/company/tasks
 * Following F-008 API spec validation rules
 * - name: required, 1-255 characters
 * - description: optional, max 5000 characters
 * - status: optional, must be "TODO" if provided (default: "TODO")
 * - project_id: optional, UUID format, must reference ACTIVE project
 */
export const TaskCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name is required")
    .max(255, "Task name must be 255 characters or less"),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be 5000 characters or less")
    .optional()
    .nullable(),
  project_id: z
    .string()
    .uuid("Project ID must be a valid UUID")
    .optional()
    .nullable(),
});

export type TaskCreateFormSchema = z.infer<typeof TaskCreateSchema>;

/**
 * Task Update Form Schema
 * PATCH /api/v1/company/tasks/{task_id}
 * For edit form: both fields are optional (partial update)
 * - name: optional, 1-255 characters (if provided)
 * - description: optional, max 5000 characters (if provided)
 */
export const TaskUpdateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Task name must be at least 1 character")
    .max(255, "Task name must be 255 characters or less")
    .optional()
    .nullable(),
  description: z
    .string()
    .trim()
    .max(5000, "Description must be 5000 characters or less")
    .optional()
    .nullable(),
});

export type TaskUpdateFormSchema = z.infer<typeof TaskUpdateSchema>;


// Request types for F-008: Task Management & Assignment
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Task status enum values
 * Used across task operations
 */
export type TaskStatus = "TODO" | "IN_PROGRESS" | "HALT" | "REVIEW" | "DONE" | "CANCELLED";

/**
 * Task assignment permission enum values
 * Used for task assignment operations
 */
export type TaskPermission = "VIEWER" | "EDITOR";

/**
 * Base task request interface
 * Common fields shared across task operations
 */
export interface TaskBase {
  name?: string | null;
  description?: string | null;
  status?: TaskStatus | null;
  project_id?: string | null; // UUID format
}

/**
 * Assignment object for adding employees to a task
 * Used in TaskUpdate.assignments.add and TaskCreate.assignments arrays
 */
export interface TaskAssignmentAdd {
  employee_id: string; // Required, UUID format, must be employee in same company
  permission: TaskPermission; // Required, case-sensitive enum: "VIEWER" or "EDITOR"
}

/**
 * Assignment object for removing employees from a task
 * Used in TaskUpdate.assignments.remove array
 */
export interface TaskAssignmentRemove {
  employee_id: string; // Required, UUID format, must be existing assignment
}

/**
 * POST /api/v1/company/tasks
 * Request body for creating a new task
 * Requires: name (required)
 * Note: owner_id and company_id are set automatically by server
 */
export interface TaskCreate extends TaskBase {
  name: string; // Required, min 1 character, max 255 characters
  description?: string | null; // Optional, max 5000 characters
  status?: TaskStatus | null; // Optional, default: "TODO", must be "TODO" if provided
  project_id?: string | null; // Optional, UUID format, must reference ACTIVE project
  assignments?: TaskAssignmentAdd[] | null; // Optional, array of initial assignments
}

/**
 * PATCH /api/v1/company/tasks/{task_id}
 * Consolidated request body for updating task details
 * Note: Partial update supported (only provided fields are updated)
 * Authorization: Field-specific permissions:
 * - Name/Description: Owner, Editor, CEO, Manager
 * - Status: Owner or Editor (assigned with EDITOR permission)
 * - Assignments: Owner, CEO, Manager
 */
export interface TaskUpdate {
  name?: string | null; // Optional, min 1 character, max 255 characters (if provided)
  description?: string | null; // Optional, max 5000 characters (if provided)
  status?: TaskStatus | null; // Optional, case-sensitive enum
  assignments?: {
    add?: TaskAssignmentAdd[] | null; // Optional, array of assignments to add
    remove?: TaskAssignmentRemove[] | null; // Optional, array of assignments to remove
  } | null; // Optional, assignment updates object
}

/**
 * GET /api/v1/company/tasks
 * Query parameters for listing tasks with pagination, filtering, search, and sorting
 * Note: page and page_size have defaults but are optional in query
 */
export interface TaskListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  status?: string | null; // Optional, filter by task status: "TODO", "IN_PROGRESS", "HALT", "REVIEW", "DONE", "CANCELLED"
  project_id?: string | null; // Optional, filter by project ID (RFC 4122 UUID v4 format)
  search?: string | null; // Optional, search by task name (case-insensitive partial match)
  sort_by?: string; // Optional, default: "created_at", options: "created_at", "updated_at", "name", "status"
  sort_order?: "asc" | "desc"; // Optional, default: "desc"
}


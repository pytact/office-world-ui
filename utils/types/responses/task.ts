// Response types for F-008: Task Management & Assignment
// Following R3 rules: Entity Response, List Response, Mutation Response patterns

import type { TaskStatus, TaskPermission } from "../requests/task";

/**
 * Project Summary (nested in Task responses)
 * Embedded project information when task is linked to a project
 */
export interface TaskProjectSummary {
  id: string; // UUID - Project identifier
  name: string; // Project name
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED"; // Project status (only in detail response)
}

/**
 * Task Assignment (nested in Task responses)
 * Represents assignment of an employee to a task with permission level
 */
export interface TaskAssignment {
  id: string; // UUID - Assignment identifier
  employee_id: string; // UUID - Assigned employee identifier
  permission: TaskPermission; // Assignment permission: "VIEWER" or "EDITOR"
}

/**
 * Task Summary (for list responses)
 * GET /api/v1/company/tasks - list item structure
 */
export interface TaskSummary {
  task_id: string; // UUID - Task identifier
  name: string; // Task title
  status: TaskStatus; // Task lifecycle state
  project_id: string | null; // UUID - Optional project linkage (nullable)
  owner_id: string; // UUID - Task creator/owner (immutable)
  project?: TaskProjectSummary | null; // Optional project summary (embedded)
  assignments: TaskAssignment[]; // Array of task assignments
  is_owner: boolean; // Derived: true if authenticated user is task owner
  user_permission: "OWNER" | "EDITOR" | "VIEWER"; // Derived: user's permission level
  can_edit_task: boolean; // Derived: true if owner or editor
  can_change_status: boolean; // Derived: true if owner only
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
}

/**
 * Task Detail (for detail/create/update responses)
 * GET /api/v1/company/tasks/{task_id} - full task details
 * POST /api/v1/company/tasks - create response
 * PATCH /api/v1/company/tasks/{task_id} - update response
 * PATCH /api/v1/company/tasks/{task_id}/status - status update response
 */
export interface TaskDetail {
  task_id: string; // UUID - Task identifier
  company_id: string; // UUID - Owning company
  owner_id: string; // UUID - Task creator/owner (immutable)
  name: string; // Task title (1-255 characters)
  description: string; // Task details (max 5000 characters)
  status: TaskStatus; // Task lifecycle state
  project_id: string | null; // UUID - Optional project linkage (nullable)
  is_deleted: boolean; // Hard delete marker (permanent)
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  created_by: string; // UUID - Creator user ID
  updated_by: string; // UUID - Last modifier user ID
  project?: TaskProjectSummary | null; // Optional project information (embedded, only in GET detail)
  assignments?: TaskAssignment[]; // Array of task assignments (only in GET detail, empty array in POST create)
  is_owner?: boolean; // Derived: true if authenticated user is task owner (only in GET detail)
  user_permission?: "OWNER" | "EDITOR" | "VIEWER"; // Derived: user's permission level (only in GET detail)
  can_edit_task?: boolean; // Derived: true if owner or editor (only in GET detail)
  can_change_status?: boolean; // Derived: true if owner only (only in GET detail)
  can_manage_assignments?: boolean; // Derived: true if owner only (only in GET detail)
  is_task_read_only?: boolean; // Derived: true if task is in terminal state or user is VIEWER (only in GET detail)
}


/**
 * Pagination Wrapper
 * Used in list responses with pagination metadata
 */
export interface TaskPaginatedResponse {
  items: TaskSummary[]; // Array of TaskSummary objects
  total: number; // Total number of items across all pages
  page: number; // Current page number
  page_size: number; // Number of items per page
  total_pages: number; // Total number of pages
  next_page: string | null; // Full relative URL for next page (or null if no next page)
  prev_page: string | null; // Full relative URL for previous page (or null if no previous page)
}

/**
 * Standard API Response Wrapper (generic)
 * Used for all API responses: { data: T, message: string }
 */
export interface StandardResponse<T> {
  data: T;
  message: string;
}

/**
 * List Response
 * GET /api/v1/company/tasks
 * Wraps TaskPaginatedResponse in StandardResponse
 */
export interface TaskListResponse
  extends StandardResponse<TaskPaginatedResponse> {}

/**
 * Detail Response
 * GET /api/v1/company/tasks/{task_id}
 * Wraps TaskDetail in StandardResponse
 */
export interface TaskDetailResponse
  extends StandardResponse<TaskDetail> {}

/**
 * Mutation Response (Create/Update/Status Update)
 * POST /api/v1/company/tasks - create response
 * PATCH /api/v1/company/tasks/{task_id} - update response
 * PATCH /api/v1/company/tasks/{task_id}/status - status update response
 * Wraps TaskDetail in StandardResponse
 */
export interface TaskMutationResponse
  extends StandardResponse<TaskDetail> {}



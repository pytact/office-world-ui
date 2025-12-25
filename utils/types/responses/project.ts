// Response types for F-007: Project Management
// Following R3 rules: Entity Response, List Response, Mutation Response patterns

/**
 * Task Summary (nested in Project Detail response)
 * Read-only data from F-008 (Task Management & Assignment)
 */
export interface TaskSummary {
  id: string; // UUID - Task identifier
  title: string; // Task title
  status: string; // Task status (from F-008)
  assignee_id: string; // UUID - Assigned user ID
}

/**
 * Project Summary (for list responses)
 * GET /api/v1/company/projects - list item structure
 */
export interface ProjectSummary {
  id: string; // UUID - Project identifier
  name: string; // Project name (1-255 characters)
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"; // Project status (case-sensitive)
  task_count: number; // Number of associated tasks (integer, min 0)
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
}

/**
 * Project Detail (for detail/create/update responses)
 * GET /api/v1/company/projects/{project_id} - includes is_frozen and tasks
 * POST /api/v1/company/projects - create response (no is_frozen, no tasks)
 * PATCH /api/v1/company/projects/{project_id} - update response (no is_frozen, no tasks)
 */
export interface ProjectDetail {
  id: string; // UUID - Project identifier
  name: string; // Project name (1-255 characters)
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"; // Project status (case-sensitive)
  task_count: number; // Number of associated tasks (integer, min 0)
  is_frozen?: boolean; // Derived: true if status is INACTIVE or COMPLETED (only in GET detail response)
  tasks?: TaskSummary[]; // Array of task summaries (read-only from F-008, only in GET detail response)
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  created_by: string; // UUID - Creator user ID
  updated_by: string; // UUID - Last updater user ID
}

/**
 * Pagination Wrapper
 * Used in list responses with pagination metadata
 */
export interface ProjectPaginatedResponse {
  items: ProjectSummary[]; // Array of ProjectSummary objects
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
 * GET /api/v1/company/projects
 * Wraps ProjectPaginatedResponse in StandardResponse
 */
export interface ProjectListResponse
  extends StandardResponse<ProjectPaginatedResponse> {}

/**
 * Detail Response
 * GET /api/v1/company/projects/{project_id}
 * Wraps ProjectDetail in StandardResponse
 */
export interface ProjectDetailResponse
  extends StandardResponse<ProjectDetail> {}

/**
 * Mutation Response (Create/Update)
 * POST /api/v1/company/projects - create response
 * PATCH /api/v1/company/projects/{project_id} - update response
 * Wraps ProjectDetail in StandardResponse
 */
export interface ProjectMutationResponse
  extends StandardResponse<ProjectDetail> {}


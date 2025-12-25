// Request types for F-007: Project Management
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Base project request interface
 * Common fields shared across project operations
 */
export interface ProjectBase {
  name?: string | null;
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED" | null;
}

/**
 * POST /api/v1/company/projects
 * Request body for creating a new project
 * Requires: name (required), status (required)
 */
export interface ProjectCreate extends ProjectBase {
  name: string; // Required, 1-255 characters, case-insensitive unique within company
  status: "ACTIVE" | "INACTIVE" | "COMPLETED"; // Required, case-sensitive enum
}

/**
 * PATCH /api/v1/company/projects/{project_id}
 * Request body for updating project name and/or status
 * Note: At least one field (name or status) must be provided
 */
export interface ProjectUpdate {
  name?: string | null; // Optional, 1-255 characters, case-insensitive unique within company (if provided)
  status?: "ACTIVE" | "INACTIVE" | "COMPLETED" | null; // Optional, case-sensitive enum (if provided)
}

/**
 * GET /api/v1/company/projects
 * Query parameters for listing projects with pagination, filtering, search, and sorting
 * Note: page and page_size have defaults but are optional in query
 */
export interface ProjectListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  status?: string | null; // Optional, filter by status: "ACTIVE", "INACTIVE", "COMPLETED" (case-sensitive)
  search?: string | null; // Optional, search by project name (case-insensitive partial match)
  sort_by?: string; // Optional, default: "created_at", options: "created_at", "updated_at", "name", "status", "task_count"
  sort_order?: "asc" | "desc"; // Optional, default: "desc"
}


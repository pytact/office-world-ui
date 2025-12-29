// Request types for F-011: Audit Logging & Activity History
// Following R2 rules: Base, Create, Update, ListParams patterns
// Note: This is a read-only API - audit logs are system-generated only
// No Create or Update operations are available

/**
 * Sort order enum values
 * Used for audit log list sorting
 */
export type AuditLogSortOrder = "asc" | "desc";

/**
 * Sort field enum values for audit logs
 * Used for GET /api/v1/company/audit-logs sorting
 * Note: Only "created_at" is allowed per API spec
 */
export type AuditLogSortBy = "created_at";

/**
 * Base interface for audit log-related requests
 * Note: Audit logs are system-generated only, so no base fields for creation/update
 * This interface is included for consistency with R2 rules but is not used
 */
export interface AuditLogBase {
  // No fields - audit logs are immutable and system-generated
  // This interface exists for R2 pattern consistency only
}

/**
 * Request payload for creating audit log
 * Note: NOT SUPPORTED - Audit logs are system-generated only
 * UI never creates audit records
 * This interface is included for R2 pattern consistency but should never be used
 */
export interface AuditLogCreate extends AuditLogBase {
  // No fields - creation is not supported
}

/**
 * Request payload for updating audit log
 * Note: NOT SUPPORTED - Audit logs are immutable and cannot be updated
 * This interface is included for R2 pattern consistency but should never be used
 */
export interface AuditLogUpdate {
  // No fields - updates are not supported
}

/**
 * Query parameters for audit log list
 * GET /api/v1/company/audit-logs
 * Returns paginated audit logs with filtering and sorting
 * Note: Visibility is role-based (CEO/HR see all, Manager sees only tasks/projects/task_assignments)
 * Note: Company scoping is automatic from JWT org_id claim
 */
export interface AuditLogListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  start_date?: string | null; // Optional, filter by start date (ISO 8601 datetime with UTC, e.g., 2024-01-20T10:30:00Z)
  end_date?: string | null; // Optional, filter by end date (ISO 8601 datetime with UTC, e.g., 2024-01-20T10:30:00Z)
  action_code?: string | null; // Optional, filter by action code (exact match, case-sensitive, e.g., "TASK_UPDATED", "USER_INVITED")
  table_name?: string | null; // Optional, filter by table name (exact match, case-sensitive, e.g., "tasks", "users", "employees")
  sort_by?: AuditLogSortBy | string; // Optional, default: "created_at", only "created_at" is allowed
  sort_order?: AuditLogSortOrder; // Optional, default: "desc", must be "asc" or "desc"
}


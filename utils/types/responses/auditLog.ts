// Response types for F-011: Audit Logging & Activity History
// Following R3 rules: Entity Response, List Response, Mutation Response patterns
// Note: This is a read-only API - audit logs are system-generated only
// No Mutation Response needed (no create/update operations)

/**
 * Actor Object (nested in AuditLog responses)
 * Represents the user or system that performed the action
 * Null for SYSTEM-generated actions
 */
export interface AuditLogActor {
  id: string; // UUID - User ID (null for SYSTEM actions)
  first_name: string; // User first name
  last_name: string; // User last name
  role_code: string; // Role code (e.g., "ceo", "hr", "manager")
}

/**
 * Audit Log Summary (for list responses)
 * GET /api/v1/company/audit-logs - list item structure
 * Used in AuditLogPaginatedResponse.items array
 */
export interface AuditLogSummary {
  id: string; // UUID - Audit log identifier
  action_code: string; // Action identifier (free-text, feature-defined, e.g., "TASK_UPDATED", "USER_INVITED")
  table_name: string; // Affected table name (reference only, e.g., "tasks", "users", "employees")
  record_id: string | null; // UUID - Affected record identifier (nullable, reference only)
  description: string | null; // Human-readable summary (nullable, optional)
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix) - Action timestamp
  actor: AuditLogActor | null; // Actor information (nullable, null for SYSTEM actions)
  actor_display_name: string; // Human-readable actor name - Derived field: "FirstName LastName (Role)" or "SYSTEM"
}

/**
 * Audit Log Detail (for detail responses)
 * GET /api/v1/company/audit-logs/{audit_log_id} - full audit log details
 * Includes old_values, new_values, IP address, and user agent
 */
export interface AuditLogDetail {
  id: string; // UUID - Audit log identifier
  action_code: string; // Action identifier (free-text, feature-defined)
  table_name: string; // Affected table name (reference only)
  record_id: string | null; // UUID - Affected record identifier (nullable, reference only)
  description: string | null; // Human-readable summary (nullable, optional)
  old_values: Record<string, unknown> | null; // Changed fields before action (JSON object, only changed fields, nullable)
  new_values: Record<string, unknown> | null; // Changed fields after action (JSON object, only changed fields, nullable)
  ip_address: string | null; // Source IP address (nullable, optional)
  user_agent: string | null; // Client metadata (nullable, optional)
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix) - Action timestamp
  actor: AuditLogActor | null; // Actor information (nullable, null for SYSTEM actions)
  actor_display_name: string; // Human-readable actor name - Derived field: "FirstName LastName (Role)" or "SYSTEM"
  has_value_changes: boolean; // Indicates if values changed - Derived field: true when old_values or new_values are non-empty
}

/**
 * Pagination Wrapper for Audit Log List
 * Used in list responses with pagination metadata
 * GET /api/v1/company/audit-logs - paginated response structure
 */
export interface AuditLogPaginatedResponse {
  items: AuditLogSummary[]; // Array of AuditLogSummary objects
  total: number; // Total number of audit logs across all pages (≥ 0)
  page: number; // Current page number (≥ 1)
  page_size: number; // Number of items per page (1-100)
  total_pages: number; // Total number of pages (≥ 0)
  next_page: string | null; // Full relative URL for next page (includes all query parameters) or null if no next page
  prev_page: string | null; // Full relative URL for previous page (includes all query parameters) or null if no previous page
}

/**
 * Standard API Response Wrapper (generic)
 * Used for all API responses: { data: T, message: string }
 * Matches API spec response format exactly
 */
export interface StandardResponse<T> {
  data: T;
  message: string;
}

/**
 * Audit Log List Response
 * GET /api/v1/company/audit-logs
 * Wraps AuditLogPaginatedResponse in StandardResponse
 */
export interface AuditLogListResponse
  extends StandardResponse<AuditLogPaginatedResponse> {}

/**
 * Audit Log Detail Response
 * GET /api/v1/company/audit-logs/{audit_log_id}
 * Wraps AuditLogDetail in StandardResponse
 */
export interface AuditLogDetailResponse
  extends StandardResponse<AuditLogDetail> {}

/**
 * Note: No Mutation Response needed
 * Audit logs are system-generated only and immutable
 * UI never creates, edits, or deletes audit records
 */


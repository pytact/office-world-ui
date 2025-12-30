// Request types for F-012: Reports & Analytics
// Following R2 rules: Base, Create, Update, ListParams patterns
// Note: Reports are read-only derived models, so no Create/Update for reports themselves
// Export operations are the only write operations

/**
 * Report type enum values
 * Used for identifying report types across the system
 */
export type ReportType =
  | "ATTENDANCE"
  | "LEAVE"
  | "SALARY_SUMMARY"
  | "EMPLOYEE"
  | "TASK"
  | "PROJECT"
  | "AUDIT_SUMMARY";

/**
 * Sort order enum values
 * Used for report sorting
 */
export type ReportSortOrder = "asc" | "desc";

/**
 * Export status enum values
 * Used for export status tracking
 */
export type ExportStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "EXPIRED";

/**
 * Query parameters for listing accessible report types
 * GET /api/v1/reports
 * Returns all report types accessible to the authenticated user's role
 * Note: No query parameters required - returns all accessible reports based on role
 */
export interface ReportListParams {
  // No query parameters for this endpoint
  // Report types are filtered server-side by role
}

/**
 * Filter object for report views and exports
 * Contains optional filters that can be applied to reports
 * All fields are optional - empty filters object means no filters applied
 */
export interface ReportFilters {
  start_date?: string | null; // Optional, ISO 8601 format (YYYY-MM-DD), UTC timezone
  end_date?: string | null; // Optional, ISO 8601 format (YYYY-MM-DD), UTC timezone, must be >= start_date
  status?: string | null; // Optional, filter by status (enum values vary by report type)
  employee_id?: string | null; // Optional, filter by employee ID (RFC 4122 UUID v4 format, role-restricted)
  department?: string | null; // Optional, filter by department name (exact match, case-sensitive)
  project_id?: string | null; // Optional, filter by project ID (RFC 4122 UUID v4 format)
}

/**
 * Query parameters for viewing report data with filters and pagination
 * GET /api/v1/reports/{report_type}
 * Returns aggregated report data with optional filters, pagination, and sorting
 * Note: Pagination is only applicable for list-style reports (not SALARY_SUMMARY)
 */
export interface ReportViewParams {
  start_date?: string | null; // Optional, ISO 8601 format (YYYY-MM-DD), UTC timezone
  end_date?: string | null; // Optional, ISO 8601 format (YYYY-MM-DD), UTC timezone, must be >= start_date
  status?: string | null; // Optional, filter by status (enum values vary by report type)
  employee_id?: string | null; // Optional, filter by employee ID (RFC 4122 UUID v4 format, role-restricted)
  department?: string | null; // Optional, filter by department name (exact match, case-sensitive)
  project_id?: string | null; // Optional, filter by project ID (RFC 4122 UUID v4 format)
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  sort_by?: string; // Optional, default: "created_at", varies by report type
  sort_order?: ReportSortOrder; // Optional, default: "desc"
}

/**
 * Base interface for export-related requests
 * Contains common fields shared across export operations
 * Note: Exports are the only write operations in the Reports feature
 */
export interface ExportBase {
  filters?: ReportFilters | null; // Optional, filter snapshot
}

/**
 * Request payload for creating an export
 * POST /api/v1/reports/{report_type}/exports
 * Creates an asynchronous PDF export of a report view with applied filters
 * Note: Empty filters object {} exports default report view (no filters)
 * Note: Export generation is asynchronous - use status polling endpoint to check completion
 */
export interface ExportCreate extends ExportBase {
  filters?: ReportFilters | null; // Optional, filter snapshot to apply to export
}


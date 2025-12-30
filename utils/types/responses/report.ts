// Response types for F-012: Reports & Analytics
// Following R3 rules: Entity Response, List Response, Mutation Response patterns

import type { ReportType, ExportStatus } from "../requests/report";

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
 * Report Type Response
 * GET /api/v1/reports - individual report type item
 * Used in ReportTypeListResponse.data array
 */
export interface ReportTypeResponse {
  code: string; // Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
  label: string; // Human-readable report name (min 1 char, max 255 chars)
  description: string; // Report description (min 1 char, max 1000 chars)
  is_accessible: boolean; // Whether user can access this report type (always true, filtered server-side)
}

/**
 * Report Type List Response Data
 * GET /api/v1/reports - response data structure
 * Contains array of accessible report types and count
 */
export interface ReportTypeListData {
  data: ReportTypeResponse[]; // Array of ReportTypeResponse objects
  available_report_count: number; // Total count of accessible report types (min: 0)
}

/**
 * Report Type List Response
 * GET /api/v1/reports
 * Wraps ReportTypeListData in StandardResponse
 */
export interface ReportTypeListResponse
  extends StandardResponse<ReportTypeListData> {}

/**
 * Date Range Filter Option
 * Nested in FilterOptions for available date range
 */
export interface DateRangeFilterOption {
  min_date?: string | null; // Minimum available date (ISO 8601 format: YYYY-MM-DD)
  max_date?: string | null; // Maximum available date (ISO 8601 format: YYYY-MM-DD)
}

/**
 * Employee Filter Option
 * Nested in FilterOptions.employees array
 * Used for employee selection in filters
 */
export interface EmployeeFilterOption {
  employee_id: string; // UUID - Employee identifier
  name: string; // Employee name for display
}

/**
 * Project Filter Option
 * Nested in FilterOptions.projects array
 * Used for project selection in filters
 */
export interface ProjectFilterOption {
  project_id: string; // UUID - Project identifier
  name: string; // Project name for display
}

/**
 * Filter Options
 * Nested in ReportMetadata
 * Contains available filter options for the report
 */
export interface FilterOptions {
  date_range?: DateRangeFilterOption | null; // Available date range (optional)
  status?: string[] | null; // Available status values (array of strings, varies by report type)
  departments?: string[] | null; // Available departments (array of strings)
  employees?: EmployeeFilterOption[] | null; // Available employees (role-restricted, array of objects)
  projects?: ProjectFilterOption[] | null; // Available projects (array of objects)
}

/**
 * Report Metadata
 * Nested in ReportViewResponse
 * Contains report type information and available filter options
 */
export interface ReportMetadata {
  report_type: ReportType; // Report type code (enum)
  title: string; // Report title (min 1 char, max 255 chars)
  description: string; // Report description (min 1 char, max 1000 chars)
  source_features: string[]; // Source feature codes (e.g., ["F-010"])
  filter_options: FilterOptions; // Available filter options
}

/**
 * Pagination Metadata
 * Nested in ReportViewResponse for list-style reports
 * Contains pagination information
 */
export interface ReportPaginationMeta {
  items: unknown[]; // Paginated items (same as rows, convenience alias)
  total: number; // Total number of items (min: 0)
  page: number; // Current page number (min: 1)
  page_size: number; // Items per page (min: 1, max: 100)
  total_pages: number; // Total number of pages (min: 0)
  next_page: string | null; // Full relative URL for next page (or null)
  prev_page: string | null; // Full relative URL for previous page (or null)
}

/**
 * Attendance Report Row
 * Report-specific row structure for ATTENDANCE report type
 * Used in ReportViewResponse.rows array
 */
export interface AttendanceReportRow {
  employee_id: string; // UUID - Employee identifier
  employee_name: string; // Employee name
  date: string; // Date (ISO 8601 format: YYYY-MM-DD)
  status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY"; // Attendance status
  check_in_time: string; // ISO 8601 datetime format (UTC, Z suffix)
  check_out_time: string; // ISO 8601 datetime format (UTC, Z suffix)
  hours_worked: number; // Hours worked (decimal)
}

/**
 * Leave Report Row
 * Report-specific row structure for LEAVE report type
 * Used in ReportViewResponse.rows array
 */
export interface LeaveReportRow {
  leave_id: string; // UUID - Leave identifier
  employee_id: string; // UUID - Employee identifier
  employee_name: string; // Employee name
  leave_type: string; // Leave type (e.g., "ANNUAL")
  start_date: string; // Start date (ISO 8601 format: YYYY-MM-DD)
  end_date: string; // End date (ISO 8601 format: YYYY-MM-DD)
  days: number; // Number of days
  status: "APPLIED" | "APPROVED" | "REJECTED" | "CANCELLED"; // Leave status
  applied_date: string; // Applied date (ISO 8601 datetime format, UTC, Z suffix)
}

/**
 * Task Report Row
 * Report-specific row structure for TASK report type
 * Used in ReportViewResponse.rows array
 */
export interface TaskReportRow {
  task_id: string; // UUID - Task identifier
  task_name: string; // Task name
  project_id: string; // UUID - Project identifier
  project_name: string; // Project name
  assigned_to: string; // UUID - Assigned employee identifier
  assigned_to_name: string; // Assigned employee name
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Task status
  priority: string; // Task priority (e.g., "HIGH")
  due_date: string; // Due date (ISO 8601 format: YYYY-MM-DD)
  progress: number; // Progress percentage (0-100)
}

/**
 * Project Report Row
 * Report-specific row structure for PROJECT report type
 * Used in ReportViewResponse.rows array
 */
export interface ProjectReportRow {
  project_id: string; // UUID - Project identifier
  project_name: string; // Project name
  description: string; // Project description
  status: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "ON_HOLD"; // Project status
  start_date: string; // Start date (ISO 8601 format: YYYY-MM-DD)
  end_date: string; // End date (ISO 8601 format: YYYY-MM-DD)
  progress: number; // Progress percentage (0-100)
  total_tasks: number; // Total number of tasks
  completed_tasks: number; // Number of completed tasks
  department: string; // Department name
}

/**
 * Employee Report Row
 * Report-specific row structure for EMPLOYEE report type
 * Used in ReportViewResponse.rows array
 */
export interface EmployeeReportRow {
  employee_id: string; // UUID - Employee identifier
  employee_name: string; // Employee name
  email: string; // Employee email
  department: string; // Department name
  role: string; // Employee role
  status: "ACTIVE" | "INACTIVE" | "TERMINATED"; // Employee status
  hire_date: string; // Hire date (ISO 8601 format: YYYY-MM-DD)
}

/**
 * Audit Summary Report Row
 * Report-specific row structure for AUDIT_SUMMARY report type
 * Used in ReportViewResponse.rows array
 */
export interface AuditSummaryReportRow {
  timestamp: string; // Timestamp (ISO 8601 datetime format, UTC, Z suffix)
  action: string; // Action type (e.g., "USER_LOGIN")
  user_id: string; // UUID - User identifier
  user_name: string; // User name
  resource_type: string; // Resource type (e.g., "USER")
  resource_id: string; // UUID - Resource identifier
  status: "SUCCESS" | "FAILURE" | "ERROR"; // Action status
  ip_address: string; // IP address
}

/**
 * Report Totals (Generic)
 * Aggregated totals for reports
 * Structure varies by report type
 */
export type ReportTotals = Record<string, unknown>;

/**
 * Attendance Report Totals
 * Totals structure for ATTENDANCE report type
 */
export interface AttendanceReportTotals {
  total_employees: number; // Total number of employees
  total_present: number; // Total present count
  total_absent: number; // Total absent count
  total_late?: number; // Total late count (optional)
  total_hours: number; // Total hours worked
}

/**
 * Leave Report Totals
 * Totals structure for LEAVE report type
 */
export interface LeaveReportTotals {
  total_applications: number; // Total leave applications
  total_approved: number; // Total approved leaves
  total_rejected: number; // Total rejected leaves
  total_pending: number; // Total pending leaves
  total_days: number; // Total leave days
}

/**
 * Salary Summary Report Totals
 * Totals structure for SALARY_SUMMARY report type
 * Note: SALARY_SUMMARY has no rows, only totals
 */
export interface SalarySummaryReportTotals {
  company_total_salary: number; // Company total salary
  currency: string; // Currency code (e.g., "USD")
  period: string; // Period (e.g., "2024-01")
  employee_count: number; // Total employee count
}

/**
 * Employee Report Totals
 * Totals structure for EMPLOYEE report type
 */
export interface EmployeeReportTotals {
  total_employees: number; // Total number of employees
  active_employees: number; // Active employees count
  inactive_employees: number; // Inactive employees count
  terminated_employees: number; // Terminated employees count
  departments: string[]; // Array of department names
}

/**
 * Task Report Totals
 * Totals structure for TASK report type
 */
export interface TaskReportTotals {
  total_tasks: number; // Total number of tasks
  pending_tasks: number; // Pending tasks count
  in_progress_tasks: number; // In-progress tasks count
  completed_tasks: number; // Completed tasks count
  cancelled_tasks: number; // Cancelled tasks count
}

/**
 * Project Report Totals
 * Totals structure for PROJECT report type
 */
export interface ProjectReportTotals {
  total_projects: number; // Total number of projects
  planning_projects: number; // Planning projects count
  in_progress_projects: number; // In-progress projects count
  completed_projects: number; // Completed projects count
  cancelled_projects: number; // Cancelled projects count
}

/**
 * Audit Summary Report Totals
 * Totals structure for AUDIT_SUMMARY report type
 */
export interface AuditSummaryReportTotals {
  total_events: number; // Total number of events
  success_events: number; // Success events count
  failure_events: number; // Failure events count
  error_events: number; // Error events count
  unique_users: number; // Unique users count
}

/**
 * Report View Response Data
 * GET /api/v1/reports/{report_type} - response data structure
 * Contains metadata, rows, totals, pagination, and export flag
 */
export interface ReportViewData {
  metadata: ReportMetadata; // Report metadata and filter options
  rows: unknown[] | null; // Report data rows (array for list-style reports, null for aggregate reports)
  totals: ReportTotals; // Aggregated totals (structure varies by report type)
  pagination: ReportPaginationMeta | null; // Pagination metadata (null for aggregate reports like SALARY_SUMMARY)
  row_count: number | null; // Total number of rows before pagination (null for aggregate reports)
  has_export: boolean; // Whether export functionality is available (always true)
}

/**
 * Report View Response
 * GET /api/v1/reports/{report_type}
 * Wraps ReportViewData in StandardResponse
 */
export interface ReportViewResponse
  extends StandardResponse<ReportViewData> {}

/**
 * Export Response (Base)
 * Base structure for export responses
 * Used in export creation and status check responses
 */
export interface ExportResponse {
  export_id: string; // UUID - Unique export identifier
  report_type: ReportType; // Report type code (enum)
  status: ExportStatus; // Export status (enum)
  created_at: string; // Export creation timestamp (ISO 8601 format, UTC, Z suffix)
  expires_at: string; // Export expiration timestamp (ISO 8601 format, UTC, Z suffix, 24 hours from creation)
  completed_at?: string | null; // Export completion timestamp (present if COMPLETED)
  failed_at?: string | null; // Export failure timestamp (present if FAILED)
  file_url?: string | null; // Download URL for completed export (present if COMPLETED, full relative URL or null)
  file_size?: number | null; // PDF file size in bytes (present if COMPLETED, min: 0)
  error_message?: string | null; // Error message if export failed (present if FAILED)
}

/**
 * Export Creation Response Data
 * POST /api/v1/reports/{report_type}/exports - response data structure
 * Contains export creation information
 */
export interface ExportCreationData {
  export_id: string; // UUID - Unique export identifier
  report_type: ReportType; // Report type code (enum)
  status: ExportStatus; // Export status (enum, initially "PENDING")
  created_at: string; // Export creation timestamp (ISO 8601 format, UTC, Z suffix)
  expires_at: string; // Export expiration timestamp (ISO 8601 format, UTC, Z suffix, 24 hours from creation)
}

/**
 * Export Creation Response
 * POST /api/v1/reports/{report_type}/exports
 * Wraps ExportCreationData in StandardResponse
 */
export interface ExportCreationResponse
  extends StandardResponse<ExportCreationData> {}

/**
 * Export Status Response Data
 * GET /api/v1/reports/{report_type}/exports/{export_id} - response data structure
 * Contains export status information (varies by status)
 */
export type ExportStatusData = ExportResponse;

/**
 * Export Status Response
 * GET /api/v1/reports/{report_type}/exports/{export_id}
 * Wraps ExportStatusData in StandardResponse
 */
export interface ExportStatusResponse
  extends StandardResponse<ExportStatusData> {}

/**
 * Export Mutation Response
 * Used for export creation operations
 * Wraps ExportCreationData in StandardResponse
 */
export interface ExportMutationResponse
  extends StandardResponse<ExportCreationData> {}


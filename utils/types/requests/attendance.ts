// Request types for F-010: Attendance Management
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Attendance status enum values
 * Used for filtering attendance records
 */
export type AttendanceStatus = "NOT_STARTED" | "CHECKED_IN" | "CHECKED_OUT";

/**
 * Sort order enum values
 * Used for attendance list sorting
 */
export type AttendanceSortOrder = "asc" | "desc";

/**
 * Sort field enum values for attendance history
 * Used for GET /v1/attendance sorting
 */
export type AttendanceHistorySortBy =
  | "attendance_date"
  | "check_in_time"
  | "check_out_time"
  | "worked_time";

/**
 * Sort field enum values for company attendance
 * Used for GET /v1/company/attendance sorting
 */
export type CompanyAttendanceSortBy =
  | "attendance_date"
  | "check_in_time"
  | "check_out_time"
  | "worked_time"
  | "employee_name";

/**
 * Base interface for attendance-related requests
 * Contains common fields shared across attendance operations
 * POST /v1/attendance/check-in
 * POST /v1/attendance/check-out
 */
export interface AttendanceBase {
  location?: string | null; // Optional, max 500 characters, nullable
  device_info?: string | null; // Optional, max 255 characters, nullable
}

/**
 * Request payload for check-in operation
 * POST /v1/attendance/check-in
 * Note: ip_address is automatically captured server-side from request headers
 * Note: If already checked in for today, returns existing attendance record (idempotent)
 */
export interface AttendanceCheckIn extends AttendanceBase {
  location?: string | null;
  device_info?: string | null;
}

/**
 * Request payload for check-out operation
 * POST /v1/attendance/check-out
 * Note: ip_address is automatically captured server-side from request headers
 * Note: If already checked out for today, returns existing attendance record (idempotent)
 * Note: Requires prior check-in (cannot check out without checking in)
 */
export interface AttendanceCheckOut extends AttendanceBase {
  location?: string | null;
  device_info?: string | null;
}

/**
 * Query parameters for attendance history list
 * GET /v1/attendance
 * Returns paginated attendance history for authenticated employee (own records only)
 */
export interface AttendanceListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  start_date?: string | null; // Optional, filter by start date (ISO 8601 date format: YYYY-MM-DD)
  end_date?: string | null; // Optional, filter by end date (ISO 8601 date format: YYYY-MM-DD)
  status?: AttendanceStatus | null; // Optional, filter by status: NOT_STARTED, CHECKED_IN, CHECKED_OUT
  sort_by?: AttendanceHistorySortBy | string; // Optional, default: "attendance_date"
  sort_order?: AttendanceSortOrder; // Optional, default: "desc"
}

/**
 * Query parameters for company attendance list
 * GET /v1/company/attendance
 * Returns paginated attendance records with filters (Manager/HR/CEO only)
 * Note: employee_id filter is only available for HR and CEO roles
 * Note: Managers can view all employees in their scope but cannot filter by specific employee_id
 */
export interface CompanyAttendanceListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  employee_id?: string | null; // Optional, filter by employee ID (UUID format, HR/CEO only)
  start_date?: string | null; // Optional, filter by start date (ISO 8601 date format: YYYY-MM-DD)
  end_date?: string | null; // Optional, filter by end date (ISO 8601 date format: YYYY-MM-DD)
  status?: AttendanceStatus | null; // Optional, filter by status: NOT_STARTED, CHECKED_IN, CHECKED_OUT
  sort_by?: CompanyAttendanceSortBy | string; // Optional, default: "attendance_date"
  sort_order?: AttendanceSortOrder; // Optional, default: "desc"
}


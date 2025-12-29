// Response types for F-010: Attendance Management
// Following R3 rules: Entity Response, List Response, Mutation Response patterns

import type { AttendanceStatus } from "../requests/attendance";

/**
 * Employee Summary (nested in Attendance responses)
 * Embedded employee information in attendance responses
 */
export interface AttendanceEmployeeSummary {
  id: string; // UUID - Employee identifier
  first_name: string; // Employee first name (max 255 characters)
  last_name: string; // Employee last name (max 255 characters)
}

/**
 * Attendance Context (for today's attendance)
 * GET /v1/attendance/today - context data
 */
export interface AttendanceContext {
  server_time: string; // ISO 8601 datetime format (UTC, Z suffix) - Current server time
  employee_timezone: string; // IANA timezone identifier (e.g., "Asia/Kolkata")
}

/**
 * Attendance Response (full entity)
 * Base attendance record structure with all fields
 * Used in detail responses and mutation responses
 */
export interface AttendanceResponse {
  id: string; // UUID - Attendance record identifier
  employee_id: string; // UUID - Employee identifier
  company_id: string; // UUID - Company identifier
  attendance_date: string; // ISO 8601 date format (YYYY-MM-DD) - Local calendar date
  check_in_time: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null if not checked in
  check_out_time: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null if not checked out
  status: AttendanceStatus; // Attendance lifecycle state: NOT_STARTED, CHECKED_IN, CHECKED_OUT
  worked_time: string | null; // Derived duration (e.g., "9h 29m") or null if not checked out
  is_auto_check_out: boolean; // Flag indicating if check-out was automatic
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
}

/**
 * Attendance Summary (for list responses)
 * GET /v1/attendance - list item structure
 * Used in AttendancePaginatedResponse.items array
 */
export interface AttendanceSummary {
  id: string; // UUID - Attendance record identifier
  attendance_date: string; // ISO 8601 date format (YYYY-MM-DD)
  check_in_time: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null
  check_out_time: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null
  status: AttendanceStatus; // Attendance lifecycle state: NOT_STARTED, CHECKED_IN, CHECKED_OUT
  worked_time: string | null; // Derived duration (e.g., "9h 29m") or null if not checked out
  is_auto_check_out: boolean; // Flag indicating if check-out was automatic
}

/**
 * Company Attendance Summary (for company list responses)
 * GET /v1/company/attendance - list item structure with employee info
 * Used in CompanyAttendancePaginatedResponse.items array
 */
export interface CompanyAttendanceSummary {
  id: string; // UUID - Attendance record identifier
  employee: AttendanceEmployeeSummary; // Nested employee information
  attendance_date: string; // ISO 8601 date format (YYYY-MM-DD)
  status: AttendanceStatus; // Attendance lifecycle state: NOT_STARTED, CHECKED_IN, CHECKED_OUT
  worked_time: string | null; // Derived duration (e.g., "9h 29m") or null if not checked out
  is_auto_check_out: boolean; // Flag indicating if check-out was automatic
}

/**
 * Attendance Log Response
 * Immutable event log entry for attendance actions
 * Used in AttendanceDetailResponse.logs array
 */
export interface AttendanceLogResponse {
  id: string; // UUID - Attendance log entry identifier
  action_type: "CHECK_IN" | "CHECK_OUT" | "AUTO_CHECK_OUT"; // Attendance action type
  action_time: string; // ISO 8601 datetime format (UTC, Z suffix) - Server timestamp of action
  location: string | null; // Location information (max 500 characters) or null
  ip_address: string | null; // Client IP address (IPv4 or IPv6 format) or null
  device_info: string | null; // Device information (max 255 characters) or null
  notes: string | null; // System notes (max 1000 characters) or null
  is_auto_action: boolean; // Flag indicating if action was automatic
}

/**
 * Attendance Today Response Data
 * GET /v1/attendance/today - response data structure
 * Includes attendance record and context information
 */
export interface AttendanceTodayData {
  attendance: AttendanceResponse; // Full attendance record for today
  context: AttendanceContext; // Contextual information (server_time, employee_timezone)
}

/**
 * Attendance Detail Response Data
 * GET /v1/company/attendance/{employee_id}/{date} - response data structure
 * Includes attendance record, employee info, and logs array
 */
export interface AttendanceDetailData {
  attendance: AttendanceResponse; // Full attendance record
  employee: AttendanceEmployeeSummary; // Employee information
  logs: AttendanceLogResponse[]; // Array of attendance log entries (chronological order, oldest first)
}

/**
 * Pagination Wrapper for Attendance History
 * Used in list responses with pagination metadata
 * GET /v1/attendance - paginated response structure
 */
export interface AttendancePaginatedResponse {
  items: AttendanceSummary[]; // Array of AttendanceSummary objects
  total: number; // Total number of items across all pages (≥ 0)
  page: number; // Current page number (≥ 1)
  page_size: number; // Number of items per page (1-100)
  total_pages: number; // Total number of pages (≥ 0)
  next_page: string | null; // Full relative URL for next page (or null if no next page)
  prev_page: string | null; // Full relative URL for previous page (or null if no previous page)
}

/**
 * Pagination Wrapper for Company Attendance
 * Used in company list responses with pagination metadata
 * GET /v1/company/attendance - paginated response structure
 */
export interface CompanyAttendancePaginatedResponse {
  items: CompanyAttendanceSummary[]; // Array of CompanyAttendanceSummary objects
  total: number; // Total number of items across all pages (≥ 0)
  page: number; // Current page number (≥ 1)
  page_size: number; // Number of items per page (1-100)
  total_pages: number; // Total number of pages (≥ 0)
  next_page: string | null; // Full relative URL for next page (or null if no next page)
  prev_page: string | null; // Full relative URL for previous page (or null if no previous page)
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
 * Today's Attendance Response
 * GET /v1/attendance/today
 * Wraps AttendanceTodayData in StandardResponse
 */
export interface AttendanceTodayResponse
  extends StandardResponse<AttendanceTodayData> {}

/**
 * Attendance History List Response
 * GET /v1/attendance
 * Wraps AttendancePaginatedResponse in StandardResponse
 */
export interface AttendanceListResponse
  extends StandardResponse<AttendancePaginatedResponse> {}

/**
 * Company Attendance List Response
 * GET /v1/company/attendance
 * Wraps CompanyAttendancePaginatedResponse in StandardResponse
 */
export interface CompanyAttendanceListResponse
  extends StandardResponse<CompanyAttendancePaginatedResponse> {}

/**
 * Attendance Detail Response
 * GET /v1/company/attendance/{employee_id}/{date}
 * Wraps AttendanceDetailData in StandardResponse
 */
export interface AttendanceDetailResponse
  extends StandardResponse<AttendanceDetailData> {}

/**
 * Attendance Mutation Response (Check-In/Check-Out)
 * POST /v1/attendance/check-in - check-in response
 * POST /v1/attendance/check-out - check-out response
 * Wraps AttendanceResponse in StandardResponse
 */
export interface AttendanceMutationResponse
  extends StandardResponse<AttendanceResponse> {}


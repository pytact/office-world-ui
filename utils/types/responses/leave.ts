// Response types for F-009: Leave Management
// Following R3 rules: Entity Response, List Response, Mutation Response patterns

import type {
  LeaveType,
  DayType,
  LeaveStatus,
} from "../requests/leave";

/**
 * Employee Summary (nested in Leave responses)
 * Embedded employee information in leave request responses
 */
export interface LeaveEmployeeSummary {
  id: string; // UUID - Employee identifier
  first_name: string; // Employee first name
  last_name: string; // Employee last name
}

/**
 * Leave Summary (for list responses)
 * GET /api/v1/company/leaves - list item structure
 * Used in LeavePaginatedResponse.items array
 */
export interface LeaveSummary {
  id: string; // UUID - Leave request identifier
  employee_id: string; // UUID - Applicant employee identifier
  employee: LeaveEmployeeSummary; // Nested employee information
  leave_type: LeaveType; // Type of leave: CASUAL, SICK, PAID, UNPAID
  start_date: string; // ISO 8601 date format (YYYY-MM-DD)
  end_date: string; // ISO 8601 date format (YYYY-MM-DD)
  day_type: DayType; // Full or half day: FULL_DAY, FIRST_HALF, SECOND_HALF
  number_of_days: number; // Calculated duration (decimal, e.g., 3.0, 0.5)
  manager_status: LeaveStatus; // Manager workflow status: PENDING_MANAGER, APPROVED_MANAGER, REJECTED_MANAGER, CANCELLED
  hr_status: LeaveStatus; // HR workflow status: PENDING_HR, APPROVED_HR, REJECTED_HR, CANCELLED
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
}

/**
 * Leave Detail (for detail/create/action responses)
 * GET /api/v1/company/leaves/{leave_id} - full leave details
 * POST /api/v1/company/leaves - create response
 * POST /api/v1/company/leaves/{leave_id}/action - action response (approve/reject/cancel)
 */
export interface LeaveDetail {
  id: string; // UUID - Leave request identifier
  employee_id: string; // UUID - Applicant employee identifier
  employee: LeaveEmployeeSummary; // Nested employee information
  company_id: string; // UUID - Owning company identifier
  leave_type: LeaveType; // Type of leave: CASUAL, SICK, PAID, UNPAID
  start_date: string; // ISO 8601 date format (YYYY-MM-DD)
  end_date: string; // ISO 8601 date format (YYYY-MM-DD)
  day_type: DayType; // Full or half day: FULL_DAY, FIRST_HALF, SECOND_HALF
  number_of_days: number; // Calculated duration (decimal, e.g., 3.0, 0.5)
  reason: string; // Reason for leave (min 10, max 500 characters)
  manager_status: LeaveStatus; // Manager workflow status: PENDING_MANAGER, APPROVED_MANAGER, REJECTED_MANAGER, CANCELLED
  manager_approver_id: string; // UUID - Assigned manager approver identifier
  manager_approved_at: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null if not approved
  manager_rejection_reason: string | null; // Rejection reason from manager or null if not rejected
  hr_status: LeaveStatus; // HR workflow status: PENDING_HR, APPROVED_HR, REJECTED_HR, CANCELLED
  hr_approver_id: string; // UUID - Assigned HR approver identifier
  hr_approved_at: string | null; // ISO 8601 datetime format (UTC, Z suffix) or null if not approved
  hr_rejection_reason: string | null; // Rejection reason from HR or null if not rejected
  created_at: string; // ISO 8601 datetime format (UTC, Z suffix)
  updated_at: string; // ISO 8601 datetime format (UTC, Z suffix)
}

/**
 * Pagination Wrapper
 * Used in list responses with pagination metadata
 * GET /api/v1/company/leaves - paginated response structure
 */
export interface LeavePaginatedResponse {
  items: LeaveSummary[]; // Array of LeaveSummary objects
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
 * Matches API spec response format exactly
 */
export interface StandardResponse<T> {
  data: T;
  message: string;
}

/**
 * List Response
 * GET /api/v1/company/leaves
 * Wraps LeavePaginatedResponse in StandardResponse
 */
export interface LeaveListResponse
  extends StandardResponse<LeavePaginatedResponse> {}

/**
 * Detail Response
 * GET /api/v1/company/leaves/{leave_id}
 * Wraps LeaveDetail in StandardResponse
 */
export interface LeaveDetailResponse
  extends StandardResponse<LeaveDetail> {}

/**
 * Mutation Response (Create/Action)
 * POST /api/v1/company/leaves - create response
 * POST /api/v1/company/leaves/{leave_id}/action - action response (approve/reject/cancel)
 * Wraps LeaveDetail in StandardResponse
 */
export interface LeaveMutationResponse
  extends StandardResponse<LeaveDetail> {}


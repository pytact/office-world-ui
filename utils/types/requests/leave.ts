// Request types for F-009: Leave Management
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Leave type enum values
 * Used for leave request creation
 */
export type LeaveType = "CASUAL" | "SICK" | "PAID" | "UNPAID";

/**
 * Day type enum values
 * Used for leave request creation (full day or half day)
 */
export type DayType = "FULL_DAY" | "FIRST_HALF" | "SECOND_HALF";

/**
 * Leave action type enum values
 * Used for leave request actions (approve, reject, cancel)
 */
export type LeaveActionType = "approve" | "reject" | "cancel";

/**
 * Leave status enum values
 * Used for filtering leave requests
 * Note: API returns manager_status and hr_status separately
 */
export type LeaveStatus =
  | "PENDING_MANAGER"
  | "APPROVED_MANAGER"
  | "REJECTED_MANAGER"
  | "PENDING_HR"
  | "APPROVED_HR"
  | "REJECTED_HR"
  | "CANCELLED";

/**
 * Sort field enum values
 * Used for leave list sorting
 */
export type LeaveSortBy = "created_at" | "updated_at" | "start_date" | "end_date";

/**
 * POST /api/v1/company/leaves
 * Request body for creating a new leave request
 * All fields are required
 * Note: employee_id and company_id are set automatically by server from JWT token
 */
export interface LeaveCreate {
  leave_type: LeaveType; // Required, case-sensitive enum: CASUAL, SICK, PAID, UNPAID
  start_date: string; // Required, ISO 8601 date format (YYYY-MM-DD), must be working day, must be >= today
  end_date: string; // Required, ISO 8601 date format (YYYY-MM-DD), must be >= start_date, must be working day
  day_type: DayType; // Required, case-sensitive enum: FULL_DAY, FIRST_HALF, SECOND_HALF
  reason: string; // Required, min 10 characters, max 500 characters
  manager_approver_id: string; // Required, RFC 4122 UUID v4 format, must exist in same company, must have Manager role
  hr_approver_id: string; // Required, RFC 4122 UUID v4 format, must exist in same company, must have HR role
}

/**
 * POST /api/v1/company/leaves/{leave_id}/action
 * Request body for approving, rejecting, or cancelling a leave request
 * Note: rejection_reason is required if action is "reject" (enforced server-side)
 * Note: Requires If-Match header with ETag from GET response for concurrency control
 */
export interface LeaveAction {
  action: LeaveActionType; // Required, case-sensitive lowercase enum: approve, reject, cancel
  rejection_reason?: string | null; // Optional, required if action is "reject", min 10 characters, max 500 characters
}

/**
 * GET /api/v1/company/leaves
 * Query parameters for listing leave requests with pagination, filtering, and sorting
 * Note: page and page_size have defaults but are optional in query
 * Note: All filter fields are optional
 */
export interface LeaveListParams {
  page?: number; // Optional, default: 1, minimum: 1
  page_size?: number; // Optional, default: 20, range: 1-100
  status?: string | null; // Optional, filter by manager_status or hr_status: PENDING_MANAGER, APPROVED_MANAGER, REJECTED_MANAGER, PENDING_HR, APPROVED_HR, REJECTED_HR, CANCELLED
  start_date?: string | null; // Optional, filter by start_date (ISO 8601 date format: YYYY-MM-DD)
  end_date?: string | null; // Optional, filter by end_date (ISO 8601 date format: YYYY-MM-DD)
  employee_id?: string | null; // Optional, filter by employee_id (UUID format, HR/CEO only, validated server-side)
  pending_for_me?: boolean | null; // Optional, filter to show only leave requests awaiting current user's approval (true/false)
  sort_by?: string; // Optional, default: "created_at", options: created_at, updated_at, start_date, end_date
  sort_order?: "asc" | "desc"; // Optional, default: "desc"
}


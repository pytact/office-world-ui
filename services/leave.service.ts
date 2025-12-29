// Leave Service
// F-009: Leave Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  LeaveCreate,
  LeaveAction,
  LeaveListParams,
} from "@/utils/types/requests/leave";

import {
  LeaveListResponse,
  LeaveDetailResponse,
  LeaveMutationResponse,
} from "@/utils/types/responses/leave";

const basePath = "/v1/company/leaves";

export const LeaveService = {
  /**
   * GET /api/v1/company/leaves
   * List leave requests with pagination, filtering, and sorting
   * Visibility is role-based:
   * - Employee: Own leave requests only
   * - Manager: Leave requests assigned to them for approval
   * - HR/CEO: All company leave requests
   * - SuperAdmin: All companies (requires company context)
   */
  list: async (params?: LeaveListParams): Promise<LeaveListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
      }
      if (params?.employee_id) {
        searchParams.append("employee_id", params.employee_id);
      }
      if (params?.pending_for_me !== undefined && params.pending_for_me !== null) {
        searchParams.append("pending_for_me", params.pending_for_me.toString());
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const r = await http.get<LeaveListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/leaves/{leave_id}
   * Get leave request details with full approval workflow information
   * Access is based on visibility rules:
   * - Employee: Own leave requests only
   * - Manager: Leave requests assigned to them
   * - HR/CEO: All company leave requests
   * Supports ETag-based cache validation with If-None-Match header
   */
  getById: async (leave_id: string): Promise<LeaveDetailResponse> => {
    try {
      const r = await http.get<LeaveDetailResponse>(`${basePath}/${leave_id}`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/company/leaves
   * Create a new leave request
   * Requires manager_approver_id and hr_approver_id (both must be in same company)
   * Validates overlapping leave requests, non-working days, and employee active status
   * Only active employees can create leave requests
   * Triggers notification to manager approver and HR approver
   */
  create: async (payload: LeaveCreate): Promise<LeaveMutationResponse> => {
    try {
      const r = await http.post<LeaveMutationResponse>(basePath, payload);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/company/leaves/{leave_id}/action
   * Approve, reject, or cancel a leave request
   * This is the workflow update operation (not a traditional update)
   * 
   * Authorization:
   * - Employee: Can cancel own pending leave requests
   * - Manager: Can approve/reject assigned employee leave requests at manager stage
   * - HR: Can approve/reject employee/manager leave requests at HR stage
   * - CEO: Can approve/reject HR leave requests at CEO stage
   * - Cannot approve/reject own leave requests
   * 
   * Requires If-Match header (ETag) for concurrency control
   * Triggers notifications on approve/reject/cancel
   */
  action: async (
    leave_id: string,
    payload: LeaveAction,
    etag?: string
  ): Promise<LeaveMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.post<LeaveMutationResponse>(
        `${basePath}/${leave_id}/action`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
}

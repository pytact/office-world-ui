// Salary Service
// F-006: Salary & History Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  SalaryCreate,
  SalaryRevise,
} from "@/utils/types/requests/salary";

import {
  SalaryDetailsSuccessResponse,
  SalaryHistoryListResponse,
  SalaryMutationResponse,
} from "@/utils/types/responses/salary";

const basePath = "/v1";

export const SalaryService = {
  /**
   * GET /v1/company/employees/{employee_id}/salary
   * Get active salary for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   */
  getActive: async (
    employee_id: string
  ): Promise<SalaryDetailsSuccessResponse> => {
    try {
      const r = await http.get<SalaryDetailsSuccessResponse>(
        `${basePath}/company/employees/${employee_id}/salary`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /v1/company/employees/{employee_id}/salary
   * Create initial salary for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   */
  create: async (
    employee_id: string,
    payload: SalaryCreate
  ): Promise<SalaryMutationResponse> => {
    try {
      const r = await http.post<SalaryMutationResponse>(
        `${basePath}/company/employees/${employee_id}/salary`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /v1/company/employees/{employee_id}/salary/revise
   * Revise salary (increment/change)
   * Access: CEO, HR only (Employee and Manager access denied)
   * Note: Requires If-Match header with ETag from GET active salary response
   */
  revise: async (
    employee_id: string,
    payload: SalaryRevise,
    etag?: string
  ): Promise<SalaryMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.post<SalaryMutationResponse>(
        `${basePath}/company/employees/${employee_id}/salary/revise`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/company/employees/{employee_id}/salary/history
   * Get salary history for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   * Note: Returns array (not paginated), sorted by created_at descending
   */
  getHistory: async (
    employee_id: string
  ): Promise<SalaryHistoryListResponse> => {
    try {
      const r = await http.get<SalaryHistoryListResponse>(
        `${basePath}/company/employees/${employee_id}/salary/history`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


// BankInfo Service
// F-006: Salary & History Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  BankInfoCreate,
  BankInfoUpdate,
} from "@/utils/types/requests/bankInfo";

import {
  BankInfoSuccessResponse,
  BankInfoMutationResponse,
} from "@/utils/types/responses/bankInfo";

const basePath = "/v1";

export const BankInfoService = {
  /**
   * GET /v1/company/employees/{employee_id}/salary/bank-info
   * Retrieve bank information for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   */
  get: async (
    employee_id: string
  ): Promise<BankInfoSuccessResponse> => {
    try {
      const r = await http.get<BankInfoSuccessResponse>(
        `${basePath}/company/employees/${employee_id}/salary/bank-info`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /v1/company/employees/{employee_id}/salary/bank-info
   * Create new BankInfo for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   */
  create: async (
    employee_id: string,
    payload: BankInfoCreate
  ): Promise<BankInfoMutationResponse> => {
    try {
      const r = await http.post<BankInfoMutationResponse>(
        `${basePath}/company/employees/${employee_id}/salary/bank-info`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /v1/company/employees/{employee_id}/salary/bank-info
   * Update existing BankInfo for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   * Note: Requires If-Match header with ETag from GET bank-info response
   */
  update: async (
    employee_id: string,
    payload: BankInfoUpdate,
    etag?: string
  ): Promise<BankInfoMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<BankInfoMutationResponse>(
        `${basePath}/company/employees/${employee_id}/salary/bank-info`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * DELETE /v1/company/employees/{employee_id}/salary/bank-info
   * Soft delete BankInfo for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   */
  delete: async (employee_id: string): Promise<void> => {
    try {
      await http.delete(
        `${basePath}/company/employees/${employee_id}/salary/bank-info`
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


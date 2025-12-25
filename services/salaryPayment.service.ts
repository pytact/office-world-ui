// SalaryPayment Service
// F-006: Salary & History Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

import {
  SalaryPaymentCreate,
  SalaryPaymentListParams,
  CompanySalaryPaymentListParams,
} from "@/utils/types/requests/salaryPayment";

import {
  SalaryPaymentMutationResponse,
  SalaryPaymentListResponse,
  CompanySalaryPaymentListResponse,
} from "@/utils/types/responses/salaryPayment";

const basePath = "/v1";

export const SalaryPaymentService = {
  /**
   * POST /v1/company/employees/{employee_id}/salary/salary-payments/run
   * Execute salary payment for an employee
   * Access: CEO, HR only (Employee and Manager access denied)
   * Note: Salary slip generation and email delivery are async operations
   */
  create: async (
    employee_id: string,
    payload: SalaryPaymentCreate
  ): Promise<SalaryPaymentMutationResponse> => {
    try {
      const r = await http.post<SalaryPaymentMutationResponse>(
        `${basePath}/company/employees/${employee_id}/salary/salary-payments/run`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/company/employees/{employee_id}/salary/payments
   * Get employee salary payments with pagination and filtering
   * Access: Employee (self only), CEO, HR (company scope)
   */
  list: async (
    employee_id: string,
    params?: SalaryPaymentListParams
  ): Promise<SalaryPaymentListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.year !== undefined && params.year !== null) {
        searchParams.append("year", params.year.toString());
      }
      if (params?.month !== undefined && params.month !== null) {
        searchParams.append("month", params.month.toString());
      }
      if (params?.payment_method) {
        searchParams.append("payment_method", params.payment_method);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString
        ? `${basePath}/company/employees/${employee_id}/salary/payments?${queryString}`
        : `${basePath}/company/employees/${employee_id}/salary/payments`;

      const r = await http.get<SalaryPaymentListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/salary-payments
   * Get salary payments by month/year across company
   * Access: CEO, HR only (Employee and Manager access denied)
   * Note: month and year are required query parameters
   */
  listByMonthYear: async (
    params: CompanySalaryPaymentListParams
  ): Promise<CompanySalaryPaymentListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      // Required parameters
      searchParams.append("month", params.month.toString());
      searchParams.append("year", params.year.toString());

      // Optional pagination and sorting
      if (params.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const r = await http.get<CompanySalaryPaymentListResponse>(
        `${basePath}/salary-payments?${searchParams.toString()}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


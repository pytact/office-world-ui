// Employee Service
// F-005: Employee Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  EmployeeCreate,
  EmployeeUpdate,
  EmployeeListParams,
} from "@/utils/types/requests/employee";

import {
  EmployeeListResponse,
  EmployeeDetailResponse,
  EmployeeMutationResponse,
} from "@/utils/types/responses/employee";

const basePath = "/api/v1";

export const EmployeeService = {
  /**
   * GET /api/v1/company/employees
   * List employees with pagination, search, filtering, and sorting
   * Access: CEO, HR, Manager (Employee role returns 403, SuperAdmin returns 403)
   */
  list: async (params?: EmployeeListParams): Promise<EmployeeListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.department) {
        searchParams.append("department", params.department);
      }
      if (params?.employment_status) {
        searchParams.append("employment_status", params.employment_status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString
        ? `${basePath}/company/employees?${queryString}`
        : `${basePath}/company/employees`;

      const r = await http.get<EmployeeListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/employees/{employee_id}
   * Get employee details with role-based field visibility
   * Access: CEO, HR, Manager (Employee role returns 403, SuperAdmin returns 403)
   */
  getById: async (employee_id: string): Promise<EmployeeDetailResponse> => {
    try {
      const r = await http.get<EmployeeDetailResponse>(
        `${basePath}/company/employees/${employee_id}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/company/employees
   * Create a new employee from existing User
   * Access: CEO, HR only (Manager, Employee, SuperAdmin return 403)
   */
  create: async (
    payload: EmployeeCreate
  ): Promise<EmployeeMutationResponse> => {
    try {
      const r = await http.post<EmployeeMutationResponse>(
        `${basePath}/company/employees`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/company/employees/{employee_id}
   * Update employee fields including activation/deactivation via is_active field
   * Access: CEO, HR only (Manager, Employee, SuperAdmin return 403)
   * Note: Requires If-Match header with ETag for concurrency control
   */
  update: async (
    employee_id: string,
    payload: EmployeeUpdate,
    etag?: string
  ): Promise<EmployeeMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<EmployeeMutationResponse>(
        `${basePath}/company/employees/${employee_id}`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * DELETE /api/v1/employees/{employee_id}
   * Soft delete an employee (sets is_deleted=true)
   * Access: CEO, HR only (Manager, Employee, SuperAdmin return 403)
   * Note: Requires If-Match header with ETag for concurrency control
   * Note: DELETE endpoint uses /api/v1/employees/{employee_id} path (no /company prefix)
   */
  delete: async (employee_id: string, etag?: string): Promise<void> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      await http.delete(`${basePath}/employees/${employee_id}`, {
        headers,
      });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


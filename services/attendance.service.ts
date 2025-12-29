// Attendance Service
// F-010: Attendance Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  AttendanceCheckIn,
  AttendanceCheckOut,
  AttendanceListParams,
  CompanyAttendanceListParams,
} from "@/utils/types/requests/attendance";

import {
  AttendanceTodayResponse,
  AttendanceListResponse,
  CompanyAttendanceListResponse,
  AttendanceDetailResponse,
  AttendanceMutationResponse,
} from "@/utils/types/responses/attendance";

const basePath = "/v1/attendance";
const companyBasePath = "/v1/company/attendance";

export const AttendanceService = {
  /**
   * GET /v1/attendance/today
   * Get today's attendance data for the authenticated employee
   * Returns only for today's local date (determined by employee timezone)
   * Returns 404 if no attendance record exists for today (status: NOT_STARTED)
   * Supports ETag-based cache validation with If-None-Match header
   * 
   * Access: Employee, Manager, HR, CEO (own attendance only)
   * Excluded: SuperAdmin, Deactivated employees
   */
  getToday: async (etag?: string): Promise<AttendanceTodayResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.get<AttendanceTodayResponse>(
        `${basePath}/today`,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/attendance
   * Get paginated attendance history for the authenticated employee (own records only)
   * Supports filtering by date range, status, and sorting
   * 
   * Access: Employee, Manager, HR, CEO (own attendance only)
   * Excluded: SuperAdmin, Deactivated employees
   */
  getHistory: async (
    params?: AttendanceListParams
  ): Promise<AttendanceListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const r = await http.get<AttendanceListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/company/attendance
   * Get paginated attendance records list with filters (Manager/HR/CEO only)
   * Supports filtering by employee_id (HR/CEO only), date range, status, and sorting
   * 
   * Access: Manager (employees in scope), HR (full company), CEO (full company)
   * Excluded: Employee, SuperAdmin, Deactivated employees
   * 
   * Note: employee_id filter is only available for HR and CEO roles
   * Managers can view all employees in their scope but cannot filter by specific employee_id
   */
  getCompanyList: async (
    params?: CompanyAttendanceListParams
  ): Promise<CompanyAttendanceListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.employee_id) {
        searchParams.append("employee_id", params.employee_id);
      }
      if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString
        ? `${companyBasePath}?${queryString}`
        : companyBasePath;

      const r = await http.get<CompanyAttendanceListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /v1/company/attendance/{employee_id}/{date}
   * Get detailed attendance for specific employee and date (Manager/HR/CEO only)
   * Returns full attendance record with employee info and attendance logs
   * Logs are returned in chronological order (oldest first)
   * Supports ETag-based cache validation with If-None-Match header
   * 
   * Access: Manager (employees in scope), HR (full company), CEO (full company)
   * Excluded: Employee, SuperAdmin, Deactivated employees
   * 
   * Path Parameters:
   * - employee_id: UUID format
   * - date: ISO 8601 date format (YYYY-MM-DD)
   */
  getDetail: async (
    employee_id: string,
    date: string,
    etag?: string
  ): Promise<AttendanceDetailResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.get<AttendanceDetailResponse>(
        `${companyBasePath}/${employee_id}/${date}`,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /v1/attendance/check-in
   * Record employee check-in for the current day
   * Idempotent: If already checked in for today, returns existing attendance record (200 OK)
   * Cannot check in if already checked out for today (returns 409 Conflict)
   * Creates AttendanceLog entry with action type CHECK_IN
   * 
   * Access: Employee, Manager, HR, CEO (own attendance only)
   * Excluded: SuperAdmin, Deactivated employees
   * 
   * Note: ip_address is automatically captured server-side from request headers
   */
  checkIn: async (
    payload?: AttendanceCheckIn
  ): Promise<AttendanceMutationResponse> => {
    try {
      const r = await http.post<AttendanceMutationResponse>(
        `${basePath}/check-in`,
        payload || {}
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /v1/attendance/check-out
   * Record employee check-out for the current day
   * Idempotent: If already checked out for today, returns existing attendance record (200 OK)
   * Requires prior check-in (cannot check out without checking in) - returns 404 if no check-in
   * Attendance becomes immutable after CHECKED_OUT status
   * Calculates worked_time as duration between check_in_time and check_out_time
   * Creates AttendanceLog entry with action type CHECK_OUT
   * 
   * Access: Employee, Manager, HR, CEO (own attendance only)
   * Excluded: SuperAdmin, Deactivated employees
   * 
   * Note: ip_address is automatically captured server-side from request headers
   */
  checkOut: async (
    payload?: AttendanceCheckOut
  ): Promise<AttendanceMutationResponse> => {
    try {
      const r = await http.post<AttendanceMutationResponse>(
        `${basePath}/check-out`,
        payload || {}
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


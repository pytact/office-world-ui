// Attendance Hooks
// F-010: Attendance Management
// React Query hooks for attendance operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { AttendanceService } from "@/services/attendance.service";
import {
  AttendanceCheckIn,
  AttendanceCheckOut,
  AttendanceListParams,
  CompanyAttendanceListParams,
} from "@/utils/types/requests/attendance";

/**
 * Hook for getting today's attendance for authenticated employee
 * GET /v1/attendance/today
 * Returns only for today's local date (determined by employee timezone)
 * Returns 404 if no attendance record exists for today (status: NOT_STARTED)
 * Supports ETag-based cache validation with If-None-Match header
 * 
 * Access: Employee, Manager, HR, CEO (own attendance only)
 * Excluded: SuperAdmin, Deactivated employees
 * 
 * Note: Uses shorter staleTime (30 seconds) for live counter updates
 * @param etag - Optional ETag for cache validation
 * @returns Query object with today's attendance data and state
 */
export function useAttendanceToday(etag?: string) {
  return useQuery({
    queryKey: ["attendance", "today", etag],
    queryFn: () => AttendanceService.getToday(etag),
    staleTime: 30 * 1000, // 30 seconds - needs frequent updates for live counter
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh server_time
    refetchInterval: 60 * 1000, // Poll every 60 seconds for live counter accuracy
  });
}

/**
 * Hook for listing attendance history for authenticated employee
 * GET /v1/attendance
 * Returns paginated attendance history (own records only)
 * Supports filtering by date range, status, and sorting
 * 
 * Access: Employee, Manager, HR, CEO (own attendance only)
 * Excluded: SuperAdmin, Deactivated employees
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with attendance history list data and state
 */
export function useAttendanceHistory(params?: AttendanceListParams) {
  return useQuery({
    queryKey: [
      "attendance",
      "history",
      params?.page,
      params?.page_size,
      params?.start_date,
      params?.end_date,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => AttendanceService.getHistory(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for listing company attendance records (Manager/HR/CEO only)
 * GET /v1/company/attendance
 * Returns paginated attendance records with filters
 * Supports filtering by employee_id (HR/CEO only), date range, status, and sorting
 * 
 * Access: Manager (employees in scope), HR (full company), CEO (full company)
 * Excluded: Employee, SuperAdmin, Deactivated employees
 * 
 * Note: employee_id filter is only available for HR and CEO roles
 * Managers can view all employees in their scope but cannot filter by specific employee_id
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with company attendance list data and state
 */
export function useCompanyAttendanceList(
  params?: CompanyAttendanceListParams
) {
  return useQuery({
    queryKey: [
      "attendance",
      "company",
      params?.page,
      params?.page_size,
      params?.employee_id,
      params?.start_date,
      params?.end_date,
      params?.status,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => AttendanceService.getCompanyList(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting detailed attendance for specific employee and date
 * GET /v1/company/attendance/{employee_id}/{date}
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
 * @param employee_id - Employee ID (UUID)
 * @param date - Attendance date (ISO 8601: YYYY-MM-DD)
 * @param etag - Optional ETag for cache validation
 * @returns Query object with attendance detail data and state
 */
export function useAttendanceDetail(
  employee_id: string | null,
  date: string | null,
  etag?: string
) {
  return useQuery({
    queryKey: ["attendance", "detail", employee_id, date, etag],
    queryFn: () => {
      if (!employee_id || !date) {
        throw new Error("Employee ID and date are required");
      }

      return AttendanceService.getDetail(employee_id, date, etag);
    },
    enabled: !!employee_id && !!date, // Only run query if both employee_id and date are provided
    staleTime: 5 * 60 * 1000, // 5 minutes - attendance details are immutable after CHECKED_OUT
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for checking in (recording employee check-in for current day)
 * POST /v1/attendance/check-in
 * Idempotent: If already checked in for today, returns existing attendance record (200 OK)
 * Cannot check in if already checked out for today (returns 409 Conflict)
 * Creates AttendanceLog entry with action type CHECK_IN
 * 
 * Access: Employee, Manager, HR, CEO (own attendance only)
 * Excluded: SuperAdmin, Deactivated employees
 * 
 * Note: ip_address is automatically captured server-side from request headers
 * @returns Mutation object with check-in function and state
 */
export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: AttendanceCheckIn) =>
      AttendanceService.checkIn(payload),
    onSuccess: async () => {
      // Invalidate today's attendance (check-in changes today's status)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      // Invalidate attendance history (new record added)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "history"] });
      // Invalidate company attendance list (if user has access)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "company"] });
    },
  });
}

/**
 * Hook for checking out (recording employee check-out for current day)
 * POST /v1/attendance/check-out
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
 * @returns Mutation object with check-out function and state
 */
export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: AttendanceCheckOut) =>
      AttendanceService.checkOut(payload),
    onSuccess: async () => {
      // Invalidate today's attendance (check-out changes today's status and worked_time)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      // Invalidate attendance history (worked_time calculated)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "history"] });
      // Invalidate company attendance list (status and worked_time changed)
      await queryClient.invalidateQueries({ queryKey: ["attendance", "company"] });
    },
  });
}





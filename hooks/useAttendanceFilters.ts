// Attendance Filters Hook
// Encapsulates filter state management for attendance lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import {
  AttendanceListParams,
  CompanyAttendanceListParams,
  AttendanceStatus,
} from "@/utils/types/requests/attendance";

interface UseAttendanceFiltersParams {
  initialStatus?: AttendanceStatus | null;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialEmployeeId?: string | null; // For company attendance only
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseAttendanceFiltersReturn {
  status: AttendanceStatus | null;
  startDate: string | null;
  endDate: string | null;
  employeeId: string | null;
  debouncedEmployeeId: string | null; // Debounced employeeId for API calls (R14)
  sortBy: string;
  sortOrder: "asc" | "desc";
  setStatus: (status: AttendanceStatus | null) => void;
  setStartDate: (startDate: string | null) => void;
  setEndDate: (endDate: string | null) => void;
  setEmployeeId: (employeeId: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getHistoryParams: () => Partial<AttendanceListParams>;
  getCompanyParams: () => Partial<CompanyAttendanceListParams>;
}

/**
 * Hook for managing attendance list filter state
 * Encapsulates all filter logic and transformations
 * Supports both employee history and company attendance filters
 * 
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useAttendanceFilters(
  params?: UseAttendanceFiltersParams
): UseAttendanceFiltersReturn {
  const [status, setStatus] = useState<AttendanceStatus | null>(
    params?.initialStatus ?? null
  );
  const [startDate, setStartDate] = useState<string | null>(
    params?.initialStartDate ?? null
  );
  const [endDate, setEndDate] = useState<string | null>(
    params?.initialEndDate ?? null
  );
  const [employeeId, setEmployeeId] = useState<string | null>(
    params?.initialEmployeeId ?? null
  );

  // Debounce employeeId input to prevent API calls on every keystroke (R14)
  const debouncedEmployeeId = useDebounce(employeeId, 400);

  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "attendance_date"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setStatus(null);
    setStartDate(null);
    setEndDate(null);
    setEmployeeId(null);
    setSortBy("attendance_date");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      status ||
      startDate ||
      endDate ||
      employeeId ||
      sortBy !== "attendance_date" ||
      sortOrder !== "desc"
    );
  }, [status, startDate, endDate, employeeId, sortBy, sortOrder]);

  const getHistoryParams = useCallback((): Partial<AttendanceListParams> => {
    return {
      status: status || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [status, startDate, endDate, sortBy, sortOrder]);

  const getCompanyParams =
    useCallback((): Partial<CompanyAttendanceListParams> => {
      return {
        employee_id: debouncedEmployeeId || undefined, // Use debounced value for API calls (R14)
        status: status || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        sort_by: sortBy,
        sort_order: sortOrder,
      };
    }, [debouncedEmployeeId, status, startDate, endDate, sortBy, sortOrder]);

  return {
    status,
    startDate,
    endDate,
    employeeId,
    debouncedEmployeeId, // Expose debounced value for API calls (R14)
    sortBy,
    sortOrder,
    setStatus,
    setStartDate,
    setEndDate,
    setEmployeeId,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getHistoryParams,
    getCompanyParams,
  };
}


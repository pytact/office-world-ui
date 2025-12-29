// Leave Filters Hook
// Encapsulates filter state management for leave lists
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { LeaveListParams, LeaveStatus } from "@/utils/types/requests/leave";

interface UseLeaveFiltersParams {
  initialStatus?: string | null;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialEmployeeId?: string | null;
  initialPendingForMe?: boolean | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseLeaveFiltersReturn {
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  employeeId: string | null;
  pendingForMe: boolean | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setStatus: (status: string | null) => void;
  setStartDate: (startDate: string | null) => void;
  setEndDate: (endDate: string | null) => void;
  setEmployeeId: (employeeId: string | null) => void;
  setPendingForMe: (pendingForMe: boolean | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => Partial<LeaveListParams>;
}

/**
 * Hook for managing leave list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useLeaveFilters(
  params?: UseLeaveFiltersParams
): UseLeaveFiltersReturn {
  const [status, setStatus] = useState<string | null>(
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
  const [pendingForMe, setPendingForMe] = useState<boolean | null>(
    params?.initialPendingForMe ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setStatus(null);
    setStartDate(null);
    setEndDate(null);
    setEmployeeId(null);
    setPendingForMe(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      status ||
      startDate ||
      endDate ||
      employeeId ||
      pendingForMe !== null ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [status, startDate, endDate, employeeId, pendingForMe, sortBy, sortOrder]);

  const getParams = useCallback((): Partial<LeaveListParams> => {
    return {
      status: status || undefined,
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      employee_id: employeeId || undefined,
      pending_for_me: pendingForMe !== null ? pendingForMe : undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [status, startDate, endDate, employeeId, pendingForMe, sortBy, sortOrder]);

  return {
    status,
    startDate,
    endDate,
    employeeId,
    pendingForMe,
    sortBy,
    sortOrder,
    setStatus,
    setStartDate,
    setEndDate,
    setEmployeeId,
    setPendingForMe,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}


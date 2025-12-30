// Report Filters Hook
// Encapsulates filter state management for report views
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { ReportViewParams } from "@/utils/types/requests/report";

interface UseReportFiltersParams {
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialStatus?: string | null;
  initialEmployeeId?: string | null;
  initialDepartment?: string | null;
  initialProjectId?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseReportFiltersReturn {
  startDate: string | null;
  endDate: string | null;
  status: string | null;
  employeeId: string | null;
  department: string | null;
  projectId: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setStartDate: (startDate: string | null) => void;
  setEndDate: (endDate: string | null) => void;
  setStatus: (status: string | null) => void;
  setEmployeeId: (employeeId: string | null) => void;
  setDepartment: (department: string | null) => void;
  setProjectId: (projectId: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => Partial<ReportViewParams>;
  validateDateRange: () => boolean;
}

/**
 * Hook for managing report view filter state
 * Encapsulates all filter logic and transformations
 * 
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useReportFilters(
  params?: UseReportFiltersParams
): UseReportFiltersReturn {
  const [startDate, setStartDate] = useState<string | null>(
    params?.initialStartDate ?? null
  );
  const [endDate, setEndDate] = useState<string | null>(
    params?.initialEndDate ?? null
  );
  const [status, setStatus] = useState<string | null>(
    params?.initialStatus ?? null
  );
  const [employeeId, setEmployeeId] = useState<string | null>(
    params?.initialEmployeeId ?? null
  );
  const [department, setDepartment] = useState<string | null>(
    params?.initialDepartment ?? null
  );
  const [projectId, setProjectId] = useState<string | null>(
    params?.initialProjectId ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
    setStatus(null);
    setEmployeeId(null);
    setDepartment(null);
    setProjectId(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      startDate ||
      endDate ||
      status ||
      employeeId ||
      department ||
      projectId ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [
    startDate,
    endDate,
    status,
    employeeId,
    department,
    projectId,
    sortBy,
    sortOrder,
  ]);

  const validateDateRange = useCallback((): boolean => {
    if (!startDate || !endDate) return true; // Valid if one or both are null
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return end >= start;
    } catch {
      return false;
    }
  }, [startDate, endDate]);

  const getParams = useCallback((): Partial<ReportViewParams> => {
    return {
      start_date: startDate || undefined,
      end_date: endDate || undefined,
      status: status || undefined,
      employee_id: employeeId || undefined,
      department: department || undefined,
      project_id: projectId || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [
    startDate,
    endDate,
    status,
    employeeId,
    department,
    projectId,
    sortBy,
    sortOrder,
  ]);

  return {
    startDate,
    endDate,
    status,
    employeeId,
    department,
    projectId,
    sortBy,
    sortOrder,
    setStartDate,
    setEndDate,
    setStatus,
    setEmployeeId,
    setDepartment,
    setProjectId,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
    validateDateRange,
  };
}


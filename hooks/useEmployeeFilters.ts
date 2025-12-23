// Employee Filters Hook
// Encapsulates filter state management for employee lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import {
  EmployeeListParams,
  Department,
  EmploymentStatus,
} from "@/utils/types/requests/employee";

interface UseEmployeeFiltersParams {
  initialSearch?: string;
  initialDepartment?: Department | null;
  initialEmploymentStatus?: EmploymentStatus | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseEmployeeFiltersReturn {
  search: string;
  debouncedSearch: string;
  department: Department | null;
  employmentStatus: EmploymentStatus | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSearch: (search: string) => void;
  setDepartment: (department: Department | null) => void;
  setEmploymentStatus: (status: EmploymentStatus | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => EmployeeListParams;
}

/**
 * Hook for managing employee list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useEmployeeFilters(
  params?: UseEmployeeFiltersParams
): UseEmployeeFiltersReturn {
  const [search, setSearch] = useState(params?.initialSearch || "");

  // Debounce search input to prevent API calls on every keystroke (R14)
  const debouncedSearch = useDebounce(search, 400);

  const [department, setDepartment] = useState<Department | null>(
    params?.initialDepartment ?? null
  );
  const [employmentStatus, setEmploymentStatus] =
    useState<EmploymentStatus | null>(params?.initialEmploymentStatus ?? null);
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setDepartment(null);
    setEmploymentStatus(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      department ||
      employmentStatus ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [search, department, employmentStatus, sortBy, sortOrder]);

  const getParams = useCallback((): EmployeeListParams => {
    return {
      search: debouncedSearch || undefined, // Use debounced search for API calls (R14)
      department: department || undefined,
      employment_status: employmentStatus || undefined,
      sort_by: sortBy as any,
      sort_order: sortOrder,
    };
  }, [debouncedSearch, department, employmentStatus, sortBy, sortOrder]);

  return {
    search,
    debouncedSearch,
    department,
    employmentStatus,
    sortBy,
    sortOrder,
    setSearch,
    setDepartment,
    setEmploymentStatus,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}


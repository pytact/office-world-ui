// Project Filters Hook
// Encapsulates filter state management for project lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import { ProjectListParams } from "@/utils/types/requests/project";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface UseProjectFiltersParams {
  initialSearch?: string;
  initialStatus?: ProjectStatus | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseProjectFiltersReturn {
  search: string;
  debouncedSearch: string;
  status: ProjectStatus | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSearch: (search: string) => void;
  setStatus: (status: ProjectStatus | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => ProjectListParams;
}

/**
 * Hook for managing project list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useProjectFilters(
  params?: UseProjectFiltersParams
): UseProjectFiltersReturn {
  const [search, setSearch] = useState(params?.initialSearch || "");

  // Debounce search input to prevent API calls on every keystroke (R14)
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<ProjectStatus | null>(
    params?.initialStatus ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setStatus(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      status ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [search, status, sortBy, sortOrder]);

  const getParams = useCallback((): ProjectListParams => {
    return {
      search: debouncedSearch || undefined, // Use debounced search for API calls (R14)
      status: status || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [debouncedSearch, status, sortBy, sortOrder]);

  return {
    search,
    debouncedSearch,
    status,
    sortBy,
    sortOrder,
    setSearch,
    setStatus,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}


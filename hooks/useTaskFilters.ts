// Task Filters Hook
// Encapsulates filter state management for task lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import { TaskListParams } from "@/utils/types/requests/task";
import { TaskStatus } from "@/utils/types/requests/task";

interface UseTaskFiltersParams {
  initialSearch?: string;
  initialStatus?: TaskStatus | null;
  initialProjectId?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseTaskFiltersReturn {
  search: string;
  debouncedSearch: string;
  status: TaskStatus | null;
  projectId: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | null) => void;
  setProjectId: (projectId: string | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => TaskListParams;
}

/**
 * Hook for managing task list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useTaskFilters(
  params?: UseTaskFiltersParams
): UseTaskFiltersReturn {
  const [search, setSearch] = useState(params?.initialSearch || "");

  // Debounce search input to prevent API calls on every keystroke (R14)
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<TaskStatus | null>(
    params?.initialStatus ?? null
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
    setSearch("");
    setStatus(null);
    setProjectId(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      status ||
      projectId ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [search, status, projectId, sortBy, sortOrder]);

  const getParams = useCallback((): TaskListParams => {
    return {
      search: debouncedSearch || undefined, // Use debounced search for API calls (R14)
      status: status || undefined,
      project_id: projectId || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [debouncedSearch, status, projectId, sortBy, sortOrder]);

  return {
    search,
    debouncedSearch,
    status,
    projectId,
    sortBy,
    sortOrder,
    setSearch,
    setStatus,
    setProjectId,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getParams,
  };
}


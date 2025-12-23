// Company Filters Hook
// Encapsulates filter state management for company lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import { CompanyListParams } from "@/utils/types/requests/company";

interface UseCompanyFiltersParams {
  initialSearch?: string;
  initialStatus?: "active" | "inactive" | "deleted" | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseCompanyFiltersReturn {
  search: string;
  debouncedSearch: string;
  status: "active" | "inactive" | "deleted" | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSearch: (search: string) => void;
  setStatus: (status: "active" | "inactive" | "deleted" | null) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getParams: () => CompanyListParams;
}

/**
 * Hook for managing company list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useCompanyFilters(
  params?: UseCompanyFiltersParams
): UseCompanyFiltersReturn {
  const [search, setSearch] = useState(params?.initialSearch || "");

  // Debounce search input to prevent API calls on every keystroke (R14)
  const debouncedSearch = useDebounce(search, 400);

  const [status, setStatus] = useState<"active" | "inactive" | "deleted" | null>(
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

  const getParams = useCallback((): CompanyListParams => {
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


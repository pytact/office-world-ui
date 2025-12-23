// User Filters Hook
// Encapsulates filter state management for user lists
// Following R5 rules: Business logic in hooks
// Following R14 rules: Debounced search for performance

import { useState, useCallback, useMemo } from "react";
import { useDebounce } from "@/utils/hooks";
import {
  UserPlatformListParams,
  UserCompanyListParams,
} from "@/utils/types/requests/user";

interface UseUserFiltersParams {
  initialSearch?: string;
  initialRoleCode?: string | null;
  initialStatus?: "active" | "inactive" | "pending" | "expired" | "activated" | null;
  initialCompanySlug?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseUserFiltersReturn {
  search: string;
  debouncedSearch: string; // Debounced search value for API calls (R14)
  roleCode: string | null;
  status: "active" | "inactive" | "pending" | "expired" | "activated" | null;
  companySlug: string | null;
  sortBy: string;
  sortOrder: "asc" | "desc";
  setSearch: (value: string) => void;
  setRoleCode: (value: string | null) => void;
  setStatus: (value: "active" | "inactive" | "pending" | "expired" | "activated" | null) => void;
  setCompanySlug: (value: string | null) => void;
  setSortBy: (value: string) => void;
  setSortOrder: (value: "asc" | "desc") => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  getPlatformParams: () => UserPlatformListParams;
  getCompanyParams: () => UserCompanyListParams;
}

/**
 * Hook for managing user list filter state
 * Encapsulates all filter logic and transformations
 * @param params - Initial filter values
 * @returns Filter state, handlers, and computed params
 */
export function useUserFilters(
  params?: UseUserFiltersParams
): UseUserFiltersReturn {
  const [search, setSearch] = useState(params?.initialSearch || "");
  
  // Debounce search input to prevent API calls on every keystroke (R14)
  const debouncedSearch = useDebounce(search, 400);

  const [roleCode, setRoleCode] = useState<string | null>(
    params?.initialRoleCode ?? null
  );
  const [status, setStatus] = useState<
    "active" | "inactive" | "pending" | "expired" | "activated" | null
  >(params?.initialStatus ?? null);
  const [companySlug, setCompanySlug] = useState<string | null>(
    params?.initialCompanySlug ?? null
  );
  const [sortBy, setSortBy] = useState<string>(
    params?.initialSortBy || "created_at"
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(
    params?.initialSortOrder || "desc"
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setRoleCode(null);
    setStatus(null);
    setCompanySlug(null);
    setSortBy("created_at");
    setSortOrder("desc");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return !!(
      search ||
      roleCode ||
      status ||
      companySlug ||
      sortBy !== "created_at" ||
      sortOrder !== "desc"
    );
  }, [search, roleCode, status, companySlug, sortBy, sortOrder]);

  const getPlatformParams = useCallback((): UserPlatformListParams => {
    return {
      search: debouncedSearch || undefined, // Use debounced search for API calls (R14)
      role_code: roleCode || undefined,
      status: status || undefined,
      company_slug: companySlug || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [debouncedSearch, roleCode, status, companySlug, sortBy, sortOrder]);

  const getCompanyParams = useCallback((): UserCompanyListParams => {
    return {
      search: debouncedSearch || undefined, // Use debounced search for API calls (R14)
      role_code: roleCode || undefined,
      status: status || undefined,
      sort_by: sortBy,
      sort_order: sortOrder,
    };
  }, [debouncedSearch, roleCode, status, sortBy, sortOrder]);

  return {
    search,
    debouncedSearch, // Expose debounced search for API calls (R14)
    roleCode,
    status,
    companySlug,
    sortBy,
    sortOrder,
    setSearch,
    setRoleCode,
    setStatus,
    setCompanySlug,
    setSortBy,
    setSortOrder,
    resetFilters,
    hasActiveFilters,
    getPlatformParams,
    getCompanyParams,
  };
}

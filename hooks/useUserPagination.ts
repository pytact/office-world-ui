// User Pagination Hook
// Encapsulates pagination state management and navigation
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { UserListPaginationMeta } from "@/utils/types/responses/user";

interface UseUserPaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseUserPaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetPagination: () => void;
  goToPage: (page: number) => void;
  updateFromResponse: (meta: UserListPaginationMeta) => void;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

/**
 * Hook for managing user list pagination state
 * Encapsulates pagination logic and navigation
 * @param params - Initial pagination values
 * @returns Pagination state, handlers, and computed values
 */
export function useUserPagination(
  params?: UseUserPaginationParams
): UseUserPaginationReturn {
  const [page, setPage] = useState(params?.initialPage || 1);
  const [pageSize, setPageSize] = useState(params?.initialPageSize || 20);
  const [paginationMeta, setPaginationMeta] = useState<UserListPaginationMeta | null>(null);

  const nextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const previousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const goToPage = useCallback((targetPage: number) => {
    setPage(Math.max(1, targetPage));
  }, []);

  const resetPagination = useCallback(() => {
    setPage(1);
    setPageSize(20);
    setPaginationMeta(null);
  }, []);

  const updateFromResponse = useCallback((meta: UserListPaginationMeta) => {
    setPaginationMeta(meta);
  }, []);

  const totalPages = useMemo(() => {
    return paginationMeta?.total_pages || 0;
  }, [paginationMeta]);

  const hasNextPage = useMemo(() => {
    return paginationMeta?.next_page !== null && page < totalPages;
  }, [paginationMeta, page, totalPages]);

  const hasPreviousPage = useMemo(() => {
    return paginationMeta?.prev_page !== null && page > 1;
  }, [paginationMeta, page]);

  const total = useMemo(() => {
    return paginationMeta?.total || 0;
  }, [paginationMeta]);

  return {
    page,
    pageSize,
    setPage,
    setPageSize,
    nextPage,
    previousPage,
    resetPagination,
    goToPage,
    updateFromResponse,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    total,
  };
}

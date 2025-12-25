// Task Pagination Hook
// Encapsulates pagination state management for task lists
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";

interface TaskPaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

interface UseTaskPaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseTaskPaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (targetPage: number) => void;
  resetPagination: () => void;
  updateFromResponse: (meta: TaskPaginationMeta) => void;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

/**
 * Hook for managing task list pagination state
 * Encapsulates pagination logic and navigation
 * @param params - Initial pagination values
 * @returns Pagination state, handlers, and computed values
 */
export function useTaskPagination(
  params?: UseTaskPaginationParams
): UseTaskPaginationReturn {
  const [page, setPage] = useState(params?.initialPage || 1);
  const [pageSize, setPageSize] = useState(params?.initialPageSize || 20);
  const [paginationMeta, setPaginationMeta] =
    useState<TaskPaginationMeta | null>(null);

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

  const updateFromResponse = useCallback((meta: TaskPaginationMeta) => {
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
    goToPage,
    resetPagination,
    updateFromResponse,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    total,
  };
}


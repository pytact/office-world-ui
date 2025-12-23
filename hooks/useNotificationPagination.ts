// Notification Pagination Hook
// Encapsulates pagination state management and navigation
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";

interface UseNotificationPaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface NotificationPaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

interface UseNotificationPaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetPagination: () => void;
  goToPage: (page: number) => void;
  updateFromResponse: (meta: NotificationPaginationMeta) => void;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
}

/**
 * Hook for managing notification list pagination state
 * Encapsulates pagination logic and navigation
 * @param params - Initial pagination values
 * @returns Pagination state, handlers, and computed values
 */
export function useNotificationPagination(
  params?: UseNotificationPaginationParams
): UseNotificationPaginationReturn {
  const [page, setPage] = useState(params?.initialPage || 1);
  const [pageSize, setPageSize] = useState(params?.initialPageSize || 20);
  const [paginationMeta, setPaginationMeta] =
    useState<NotificationPaginationMeta | null>(null);

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

  const updateFromResponse = useCallback(
    (meta: NotificationPaginationMeta) => {
      setPaginationMeta(meta);
    },
    []
  );

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


// Report Pagination Hook
// Encapsulates pagination state management for report views
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";

interface ReportPaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
  row_count?: number | null;
}

interface UseReportPaginationParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseReportPaginationReturn {
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (targetPage: number) => void;
  resetPagination: () => void;
  updateFromResponse: (meta: ReportPaginationMeta | null) => void;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  total: number;
  rowCount: number | null;
}

/**
 * Hook for managing report view pagination state
 * Encapsulates pagination logic and navigation
 * 
 * Note: Some reports (like SALARY_SUMMARY) don't have pagination
 * In those cases, paginationMeta will be null
 * 
 * @param params - Initial pagination values
 * @returns Pagination state, handlers, and computed values
 */
export function useReportPagination(
  params?: UseReportPaginationParams
): UseReportPaginationReturn {
  const [page, setPage] = useState(params?.initialPage || 1);
  const [pageSize, setPageSize] = useState(params?.initialPageSize || 20);
  const [paginationMeta, setPaginationMeta] =
    useState<ReportPaginationMeta | null>(null);
  const [rowCount, setRowCount] = useState<number | null>(null);

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
    setRowCount(null);
  }, []);

  const updateFromResponse = useCallback(
    (meta: ReportPaginationMeta | null) => {
      setPaginationMeta(meta);
      if (meta?.row_count !== undefined) {
        setRowCount(meta.row_count);
      }
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
    goToPage,
    resetPagination,
    updateFromResponse,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    total,
    rowCount,
  };
}


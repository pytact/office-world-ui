// Report List Data Hook
// Combines filters, pagination, query logic, and transformations for report views
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useGetReport } from "./useReports";
import { useReportFilters } from "./useReportFilters";
import { useReportPagination } from "./useReportPagination";
import { useReportTransformations } from "./useReportTransformations";
import { ReportType } from "@/utils/types/requests/report";
import { ReportViewData } from "@/utils/types/responses/report";

interface UseReportListDataParams {
  reportType: ReportType | null;
  initialPage?: number;
  initialPageSize?: number;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialStatus?: string | null;
  initialEmployeeId?: string | null;
  initialDepartment?: string | null;
  initialProjectId?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseReportListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Report metadata
  metadata: ReportViewData["metadata"] | null;
  filterOptions: ReportViewData["metadata"]["filter_options"] | null;

  // Data
  rows: unknown[];
  transformedRows: unknown[];
  totals: ReportViewData["totals"] | null;
  isEmpty: boolean;

  // Pagination
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
    rowCount: number | null;
  };
  hasPagination: boolean; // false for aggregate reports like SALARY_SUMMARY

  // Filters
  filters: ReturnType<typeof useReportFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useReportPagination>;

  // Export
  hasExport: boolean;
}

/**
 * Hook that combines filters, pagination, query logic, and transformations for report views
 * Encapsulates all business logic for report view screens
 * 
 * This hook:
 * - Manages filter state
 * - Manages pagination state
 * - Fetches report data via React Query
 * - Transforms data for display
 * - Provides computed values (isEmpty, hasPagination, etc.)
 * 
 * @param params - Configuration for report view
 * @returns Combined state, data, filters, pagination, and transformations
 */
export function useReportListData(
  params: UseReportListDataParams
): UseReportListDataReturn {
  // Initialize filters
  const filters = useReportFilters({
    initialStartDate: params.initialStartDate,
    initialEndDate: params.initialEndDate,
    initialStatus: params.initialStatus,
    initialEmployeeId: params.initialEmployeeId,
    initialDepartment: params.initialDepartment,
    initialProjectId: params.initialProjectId,
    initialSortBy: params.initialSortBy,
    initialSortOrder: params.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useReportPagination({
    initialPage: params.initialPage,
    initialPageSize: params.initialPageSize,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const filterParams = filters.getParams();
    return {
      ...filterParams,
      page: paginationControls.page,
      page_size: paginationControls.pageSize,
    };
  }, [
    filters.startDate,
    filters.endDate,
    filters.status,
    filters.employeeId,
    filters.department,
    filters.projectId,
    filters.sortBy,
    filters.sortOrder,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Use query hook
  const query = useGetReport(params.reportType, queryParams);

  // Extract metadata and filter options
  const metadata = useMemo(() => {
    return query.data?.data?.metadata || null;
  }, [query.data?.data?.metadata]);

  const filterOptions = useMemo(() => {
    return metadata?.filter_options || null;
  }, [metadata]);

  // Update pagination from response
  useEffect(() => {
    if (query.data?.data?.pagination) {
      paginationControls.updateFromResponse({
        ...query.data.data.pagination,
        row_count: query.data.data.row_count,
      });
    } else {
      // Aggregate reports (like SALARY_SUMMARY) don't have pagination
      // But we still want to track row_count if available
      paginationControls.updateFromResponse(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.data?.pagination, query.data?.data?.row_count]);

  // Extract raw rows
  const rawRows = useMemo(() => {
    return query.data?.data?.rows || [];
  }, [query.data?.data?.rows]);

  // Transform rows with formatting
  const transformedRows = useReportTransformations(
    rawRows as Record<string, unknown>[],
    params.reportType || undefined,
    {
      employees: filterOptions?.employees || null,
      projects: filterOptions?.projects || null,
    }
  );

  // Extract totals
  const totals = useMemo(() => {
    return query.data?.data?.totals || null;
  }, [query.data?.data?.totals]);

  // Computed values
  const isEmpty = useMemo(() => {
    if (!query.data?.data) return true;
    const rowCount = query.data.data.row_count;
    return rowCount === null ? false : rowCount === 0;
  }, [query.data?.data?.row_count]);

  const hasPagination = useMemo(() => {
    return query.data?.data?.pagination !== null;
  }, [query.data?.data?.pagination]);

  const pagination = useMemo(() => {
    if (!query.data?.data?.pagination) {
      return {
        total: 0,
        page: paginationControls.page,
        pageSize: paginationControls.pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        prevPage: null,
        rowCount: query.data?.data?.row_count || null,
      };
    }

    return {
      total: query.data.data.pagination.total,
      page: query.data.data.pagination.page,
      pageSize: query.data.data.pagination.page_size,
      totalPages: query.data.data.pagination.total_pages,
      hasNextPage: query.data.data.pagination.next_page !== null,
      hasPreviousPage: query.data.data.pagination.prev_page !== null,
      nextPage: query.data.data.pagination.next_page,
      prevPage: query.data.data.pagination.prev_page,
      rowCount: query.data.data.row_count,
    };
  }, [
    query.data?.data?.pagination,
    query.data?.data?.row_count,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  const hasExport = useMemo(() => {
    return query.data?.data?.has_export || false;
  }, [query.data?.data?.has_export]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    metadata,
    filterOptions,
    rows: rawRows,
    transformedRows,
    totals,
    isEmpty,
    pagination,
    hasPagination,
    filters,
    paginationControls,
    hasExport,
  };
}


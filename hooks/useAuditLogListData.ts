// Audit Log List Data Hook
// Combines filters, pagination, and query logic for audit log lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListAuditLogs } from "./useAuditLogs";
import { useAuditLogFilters } from "./useAuditLogFilters";
import { useAuditLogPagination } from "./useAuditLogPagination";
import {
  useAuditLogTransformations,
  transformAuditLogSummary,
  type TransformedAuditLogSummary,
} from "./useAuditLogTransformations";
import { AuditLogSummary } from "@/utils/types/responses/auditLog";

interface UseAuditLogListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialActionCode?: string | null;
  initialTableName?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseAuditLogListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  auditLogs: TransformedAuditLogSummary[];
  rawAuditLogs: AuditLogSummary[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
  };

  // Filters
  filters: ReturnType<typeof useAuditLogFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useAuditLogPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for audit log lists
 * Encapsulates all business logic for audit log list screens
 * 
 * @param params - Configuration for audit log list
 * @returns Combined state, data, filters, and pagination
 */
export function useAuditLogListData(
  params?: UseAuditLogListDataParams
): UseAuditLogListDataReturn {
  // Initialize filters
  const filters = useAuditLogFilters({
    initialStartDate: params?.initialStartDate,
    initialEndDate: params?.initialEndDate,
    initialActionCode: params?.initialActionCode,
    initialTableName: params?.initialTableName,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useAuditLogPagination({
    initialPage: params?.initialPage,
    initialPageSize: params?.initialPageSize,
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
    filters.actionCode,
    filters.tableName,
    filters.sortBy,
    filters.sortOrder,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Use query hook
  const query = useListAuditLogs(queryParams);

  // Update pagination from response
  useEffect(() => {
    if (query.data?.data) {
      paginationControls.updateFromResponse({
        total: query.data.data.total,
        page: query.data.data.page,
        page_size: query.data.data.page_size,
        total_pages: query.data.data.total_pages,
        next_page: query.data.data.next_page,
        prev_page: query.data.data.prev_page,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.data?.data]);

  // Transform audit log data
  const rawAuditLogs = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedAuditLogs = useAuditLogTransformations(rawAuditLogs);

  const pagination = useMemo(() => {
    if (!query.data?.data) {
      return {
        total: 0,
        page: paginationControls.page,
        pageSize: paginationControls.pageSize,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        prevPage: null,
      };
    }

    return {
      total: query.data.data.total,
      page: query.data.data.page,
      pageSize: query.data.data.page_size,
      totalPages: query.data.data.total_pages,
      hasNextPage: query.data.data.next_page !== null,
      hasPreviousPage: query.data.data.prev_page !== null,
      nextPage: query.data.data.next_page,
      prevPage: query.data.data.prev_page,
    };
  }, [query.data?.data, paginationControls.page, paginationControls.pageSize]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    auditLogs: transformedAuditLogs,
    rawAuditLogs,
    pagination,
    filters,
    paginationControls,
  };
}


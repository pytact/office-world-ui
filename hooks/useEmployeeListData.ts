// Employee List Data Hook
// Combines filters, pagination, and query logic for employee lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListEmployees } from "./useEmployees";
import { useEmployeeFilters } from "./useEmployeeFilters";
import { useEmployeePagination } from "./useEmployeePagination";
import {
  useEmployeeTransformations,
  transformEmployeeSummary,
  type TransformedEmployeeSummary,
} from "./useEmployeeTransformations";
import { EmployeeSummary } from "@/utils/types/responses/employee";
import {
  Department,
  EmploymentStatus,
} from "@/utils/types/requests/employee";

interface UseEmployeeListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialDepartment?: Department | null;
  initialEmploymentStatus?: EmploymentStatus | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseEmployeeListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  employees: TransformedEmployeeSummary[];
  rawEmployees: EmployeeSummary[];
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
  filters: ReturnType<typeof useEmployeeFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useEmployeePagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for employee lists
 * Encapsulates all business logic for employee list screens
 * @param params - Configuration for employee list
 * @returns Combined state, data, filters, and pagination
 */
export function useEmployeeListData(
  params?: UseEmployeeListDataParams
): UseEmployeeListDataReturn {
  // Initialize filters
  const filters = useEmployeeFilters({
    initialSearch: params?.initialSearch,
    initialDepartment: params?.initialDepartment,
    initialEmploymentStatus: params?.initialEmploymentStatus,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useEmployeePagination({
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
    filters,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Use query hook
  const query = useListEmployees(queryParams);

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
  }, [query.data?.data, paginationControls.updateFromResponse]);

  // Transform employee data
  const rawEmployees = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedEmployees = useEmployeeTransformations(rawEmployees);

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
    employees: transformedEmployees,
    rawEmployees,
    pagination,
    filters,
    paginationControls,
  };
}


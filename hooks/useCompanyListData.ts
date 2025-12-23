// Company List Data Hook
// Combines filters, pagination, and query logic for company lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListCompanies } from "./useCompanies";
import { useCompanyFilters } from "./useCompanyFilters";
import { useCompanyPagination } from "./useCompanyPagination";
import {
  useCompanyTransformations,
  transformCompanySummary,
  type TransformedCompany,
} from "./useCompanyTransformations";
import { CompanySummary } from "@/utils/types/responses/company";

interface UseCompanyListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialStatus?: "active" | "inactive" | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseCompanyListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  companies: TransformedCompany[];
  rawCompanies: CompanySummary[];
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
  filters: ReturnType<typeof useCompanyFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useCompanyPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for company lists
 * Encapsulates all business logic for company list screens
 * @param params - Configuration for company list
 * @returns Combined state, data, filters, and pagination
 */
export function useCompanyListData(
  params?: UseCompanyListDataParams
): UseCompanyListDataReturn {
  // Initialize filters
  const filters = useCompanyFilters({
    initialSearch: params?.initialSearch,
    initialStatus: params?.initialStatus,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useCompanyPagination({
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
  const query = useListCompanies(queryParams);

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

  // Transform company data
  const rawCompanies = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedCompanies = useCompanyTransformations(rawCompanies);

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
    companies: transformedCompanies,
    rawCompanies,
    pagination,
    filters,
    paginationControls,
  };
}


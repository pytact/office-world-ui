// Project List Data Hook
// Combines filters, pagination, and query logic for project lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListProjects } from "./useProjects";
import { useProjectFilters } from "./useProjectFilters";
import { useProjectPagination } from "./useProjectPagination";
import {
  useProjectTransformations,
  transformProjectSummary,
  type TransformedProjectSummary,
} from "./useProjectTransformations";
import { ProjectSummary } from "@/utils/types/responses/project";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface UseProjectListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialStatus?: ProjectStatus | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseProjectListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  projects: TransformedProjectSummary[];
  rawProjects: ProjectSummary[];
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
  filters: ReturnType<typeof useProjectFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useProjectPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for project lists
 * Encapsulates all business logic for project list screens
 * @param params - Configuration for project list
 * @returns Combined state, data, filters, and pagination
 */
export function useProjectListData(
  params?: UseProjectListDataParams
): UseProjectListDataReturn {
  // Initialize filters
  const filters = useProjectFilters({
    initialSearch: params?.initialSearch,
    initialStatus: params?.initialStatus,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useProjectPagination({
    initialPage: params?.initialPage,
    initialPageSize: params?.initialPageSize,
  });

  // Build query params - use debouncedSearch from filters (R14)
  const queryParams = useMemo(() => {
    const filterParams = filters.getParams(); // This already uses debouncedSearch internally
    return {
      ...filterParams,
      page: paginationControls.page,
      page_size: paginationControls.pageSize,
    };
  }, [
    filters.debouncedSearch, // Explicitly depend on debouncedSearch to trigger updates (R14)
    filters.status,
    filters.sortBy,
    filters.sortOrder,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Use query hook
  const query = useListProjects(queryParams);

  // Update pagination from response
  useEffect(() => {
    if (query.data?.data) {
      paginationControls.updateFromResponse({
        items: query.data.data.items,
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

  // Transform project data
  const rawProjects = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedProjects = useProjectTransformations(rawProjects);

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
    projects: transformedProjects,
    rawProjects,
    pagination,
    filters,
    paginationControls,
  };
}


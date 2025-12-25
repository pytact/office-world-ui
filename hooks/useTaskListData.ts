// Task List Data Hook
// Combines filters, pagination, and query logic for task lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListTasks } from "./useTasks";
import { useTaskFilters } from "./useTaskFilters";
import { useTaskPagination } from "./useTaskPagination";
import {
  useTaskTransformations,
  transformTaskSummary,
  type TransformedTaskSummary,
} from "./useTaskTransformations";
import { TaskSummary } from "@/utils/types/responses/task";
import { TaskStatus } from "@/utils/types/requests/task";

interface UseTaskListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
  initialStatus?: TaskStatus | null;
  initialProjectId?: string | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseTaskListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  tasks: TransformedTaskSummary[];
  rawTasks: TaskSummary[];
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
  filters: ReturnType<typeof useTaskFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useTaskPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for task lists
 * Encapsulates all business logic for task list screens
 * @param params - Configuration for task list
 * @returns Combined state, data, filters, and pagination
 */
export function useTaskListData(
  params?: UseTaskListDataParams
): UseTaskListDataReturn {
  // Initialize filters
  const filters = useTaskFilters({
    initialSearch: params?.initialSearch,
    initialStatus: params?.initialStatus,
    initialProjectId: params?.initialProjectId,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useTaskPagination({
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
    filters.projectId,
    filters.sortBy,
    filters.sortOrder,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Use query hook
  const query = useListTasks(queryParams);

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

  // Transform task data
  const rawTasks = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedTasks = useTaskTransformations(rawTasks);

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
    tasks: transformedTasks,
    rawTasks,
    pagination,
    filters,
    paginationControls,
  };
}


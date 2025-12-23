// Notification List Data Hook
// Combines filters, pagination, and query logic for notification lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListNotifications } from "./useNotifications";
import { useNotificationFilters } from "./useNotificationFilters";
import { useNotificationPagination } from "./useNotificationPagination";
import {
  useNotificationTransformations,
  TransformedNotification,
} from "./useNotificationTransformations";
import { NotificationResponse } from "@/utils/types/responses/notification";
import { NotificationListParams } from "@/utils/types/requests/notification";

interface UseNotificationListDataParams {
  initialPage?: number;
  initialPageSize?: number;
}

interface UseNotificationListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  notifications: TransformedNotification[];
  rawNotifications: NotificationResponse[];
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
  filters: ReturnType<typeof useNotificationFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useNotificationPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for notification lists
 * Encapsulates all business logic for notification list screens
 * @param params - Configuration for notification list
 * @returns Combined state, data, filters, and pagination
 */
export function useNotificationListData(
  params?: UseNotificationListDataParams
): UseNotificationListDataReturn {
  // Initialize filters
  const filters = useNotificationFilters();

  // Initialize pagination
  const paginationControls = useNotificationPagination({
    initialPage: params?.initialPage,
    initialPageSize: params?.initialPageSize,
  });

  // Build query params
  const queryParams = useMemo<NotificationListParams>(() => {
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
  const query = useListNotifications(queryParams);

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

  // Transform notification data
  const rawNotifications = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedNotifications = useNotificationTransformations(rawNotifications);

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
    notifications: transformedNotifications,
    rawNotifications,
    pagination,
    filters,
    paginationControls,
  };
}


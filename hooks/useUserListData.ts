// User List Data Hook
// Combines filters, pagination, and query logic for user lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListUsers, useListCompanyUsers } from "./useUsers";
import { useUserFilters } from "./useUserFilters";
import { useUserPagination } from "./useUserPagination";
import { mapUserData, type MappedUser } from "./useMappedUser";
import { UserListItemResponse } from "@/utils/types/responses/user";
import { useAuthContext } from "@/context";

interface UseUserListDataParams {
  isPlatform?: boolean; // true for platform list, false for company list
  initialPage?: number;
  initialPageSize?: number;
}

interface UseUserListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  users: MappedUser[];
  rawUsers: UserListItemResponse[];
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
  filters: ReturnType<typeof useUserFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useUserPagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for user lists
 * Encapsulates all business logic for user list screens
 * @param params - Configuration for platform or company list
 * @returns Combined state, data, filters, and pagination
 */
export function useUserListData(
  params?: UseUserListDataParams
): UseUserListDataReturn {
  const isPlatform = params?.isPlatform ?? false;

  // Initialize filters
  const filters = useUserFilters();

  // Initialize pagination
  const paginationControls = useUserPagination({
    initialPage: params?.initialPage,
    initialPageSize: params?.initialPageSize,
  });

  // Build query params
  const queryParams = useMemo(() => {
    const baseParams = isPlatform
      ? filters.getPlatformParams()
      : filters.getCompanyParams();

    return {
      ...baseParams,
      page: paginationControls.page,
      page_size: paginationControls.pageSize,
    };
  }, [
    isPlatform,
    filters,
    paginationControls.page,
    paginationControls.pageSize,
  ]);

  // Get user role to check permissions
  const { isSuperAdmin } = useAuthContext();

  // Use appropriate query hook based on context
  // Platform query only enabled for SuperAdmin
  const platformQuery = useListUsers(isPlatform && isSuperAdmin ? queryParams : undefined);
  // For company list, company_id will be auto-detected from current user
  const companyQuery = useListCompanyUsers(
    !isPlatform ? undefined : undefined, // company_id will be auto-detected
    !isPlatform ? queryParams : undefined
  );

  // Select the active query based on context
  // If platform but not SuperAdmin, use company query instead
  const query = isPlatform && isSuperAdmin ? platformQuery : companyQuery;

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
  }, [query.data?.data]);

  // Transform user data
  const mappedUsers = useMemo(() => {
    if (!query.data?.data?.items) return [];
    return query.data.data.items.map((user) => mapUserData(user));
  }, [query.data?.data?.items]);

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
    users: mappedUsers,
    rawUsers: query.data?.data?.items || [],
    pagination,
    filters,
    paginationControls,
  };
}

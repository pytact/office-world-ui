// Leave List Data Hook
// Combines filters, pagination, and query logic for leave lists
// Following R5 rules: Business logic in hooks

import { useMemo, useEffect } from "react";
import { useListLeaves } from "./useLeaves";
import { useLeaveFilters } from "./useLeaveFilters";
import { useLeavePagination } from "./useLeavePagination";
import {
  useLeaveTransformations,
  transformLeaveSummary,
  type TransformedLeaveSummary,
} from "./useLeaveTransformations";
import { LeaveSummary } from "@/utils/types/responses/leave";
import { LeaveStatus } from "@/utils/types/requests/leave";
import { useLeaveContext } from "@/context/LeaveContext";

interface UseLeaveListDataParams {
  initialPage?: number;
  initialPageSize?: number;
  initialStatus?: string | null;
  initialStartDate?: string | null;
  initialEndDate?: string | null;
  initialEmployeeId?: string | null;
  initialPendingForMe?: boolean | null;
  initialSortBy?: string;
  initialSortOrder?: "asc" | "desc";
}

interface UseLeaveListDataReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  leaves: TransformedLeaveSummary[];
  rawLeaves: LeaveSummary[];
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
  filters: ReturnType<typeof useLeaveFilters>;

  // Pagination controls
  paginationControls: ReturnType<typeof useLeavePagination>;
}

/**
 * Hook that combines filters, pagination, and query logic for leave lists
 * Encapsulates all business logic for leave list screens
 * @param params - Configuration for leave list
 * @returns Combined state, data, filters, and pagination
 */
export function useLeaveListData(
  params?: UseLeaveListDataParams
): UseLeaveListDataReturn {
  // Get user role and employee_id from context
  const { userRole, employeeId } = useLeaveContext();

  // Initialize filters
  const filters = useLeaveFilters({
    initialStatus: params?.initialStatus,
    initialStartDate: params?.initialStartDate,
    initialEndDate: params?.initialEndDate,
    initialEmployeeId: params?.initialEmployeeId,
    initialPendingForMe: params?.initialPendingForMe,
    initialSortBy: params?.initialSortBy,
    initialSortOrder: params?.initialSortOrder,
  });

  // Initialize pagination
  const paginationControls = useLeavePagination({
    initialPage: params?.initialPage,
    initialPageSize: params?.initialPageSize,
  });

  // Build query params - combine filters and pagination
  // For Managers: Automatically filter by manager_approver_id to show only assigned leaves
  // For HR: Can see all leaves at HR stage (per spec), but we can filter by hr_approver_id if needed
  const queryParams = useMemo(() => {
    const filterParams = filters.getParams();
    
    // For Managers: Only show leaves assigned to them
    // The API should handle this via visibility rules, but we can also filter client-side
    // Note: The API spec says managers see "assigned leaves", so the backend should filter
    // But we can add pending_for_me filter for managers to show only their pending approvals
    if (userRole === "manager" && employeeId) {
      // Managers should see leaves where they are the manager approver
      // Use pending_for_me to show only leaves pending their approval
      return {
        ...filterParams,
        pending_for_me: true, // Show only leaves pending manager's approval
        page: paginationControls.page,
        page_size: paginationControls.pageSize,
      };
    }
    
    // For HR: Can see all leaves at HR stage (per spec)
    // HR can approve any leave at HR stage, not just assigned ones
    // But if we want to show only assigned HR leaves, we could filter here
    // For now, HR sees all leaves (backend handles visibility)
    
    return {
      ...filterParams,
      page: paginationControls.page,
      page_size: paginationControls.pageSize,
    };
  }, [
    filters.status,
    filters.startDate,
    filters.endDate,
    filters.employeeId,
    filters.pendingForMe,
    filters.sortBy,
    filters.sortOrder,
    paginationControls.page,
    paginationControls.pageSize,
    userRole,
    employeeId,
  ]);

  // Use query hook
  const query = useListLeaves(queryParams);

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

  // Transform leave data
  const rawLeaves = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedLeaves = useLeaveTransformations(rawLeaves);

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
    leaves: transformedLeaves,
    rawLeaves,
    pagination,
    filters,
    paginationControls,
  };
}


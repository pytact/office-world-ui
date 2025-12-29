// Leave Approval Queue Container
// SCR_LEAVE_APPROVAL_QUEUE - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { LeaveApprovalQueue } from "./LeaveApprovalQueue";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListLeaves } from "@/hooks/useLeaves";
import { useLeavePagination } from "@/hooks/useLeavePagination";
import { useLeaveTransformations } from "@/hooks/useLeaveTransformations";
import { useLeaveContext } from "@/context/LeaveContext";
import { leaveRoutes } from "@/utils/routes";
import { spacing } from "@/theme/tokens";

export function LeaveApprovalQueueContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { userId } = useLeaveContext();
  const pagination = useLeavePagination();

  // Fetch pending approvals for current user
  const leavesQuery = useListLeaves({
    page: pagination.page,
    page_size: pagination.pageSize,
    pending_for_me: true, // Only fetch leaves pending for current user
  });

  // Transform leaves
  const rawLeaves = leavesQuery.data?.data?.items || [];
  const transformedLeaves = useLeaveTransformations(rawLeaves);

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: `${spacing[12]} ${spacing[6]}`,
      maxWidth: "800px", // Using fixed maxWidth for centered layout (common pattern)
      margin: "0 auto",
    } as const),
    []
  );

  // Update pagination from API response
  React.useEffect(() => {
    if (leavesQuery.data?.data) {
      pagination.updateFromResponse(leavesQuery.data.data);
    }
  }, [leavesQuery.data?.data, pagination]);

  // Memoized handlers (R14: Performance)
  const handleViewAllLeaves = useCallback(() => {
    router.push(leaveRoutes.company.list);
  }, [router]);

  const handleRetry = useCallback(() => {
    leavesQuery.refetch();
  }, [leavesQuery]);

  const handleLeaveClick = useCallback(
    (leaveId: string) => {
      router.push(leaveRoutes.company.detail(leaveId));
    },
    [router]
  );

  // Loading state (AFTER all hooks)
  if (leavesQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (leavesQuery.isError) {
    return (
      <ErrorState
        message={leavesQuery.error?.message || "Failed to load pending approvals"}
        onRetry={handleRetry}
      />
    );
  }

  // Empty state - R17: Enhanced with clear guidance
  if (!transformedLeaves || transformedLeaves.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message="No pending approvals"
          description="All leave requests have been processed. You're all caught up!"
          actionText="View All Leaves"
          onActionClick={handleViewAllLeaves}
        />
      </div>
    );
  }

  const paginationData = {
    total: leavesQuery.data?.data?.total || 0,
    page: pagination.page,
    pageSize: pagination.pageSize,
    totalPages: leavesQuery.data?.data?.total_pages || 0,
    hasNextPage: !!leavesQuery.data?.data?.next_page,
    hasPreviousPage: !!leavesQuery.data?.data?.prev_page,
    nextPage: leavesQuery.data?.data?.next_page || null,
    prevPage: leavesQuery.data?.data?.prev_page || null,
  };

  return (
    <LeaveApprovalQueue
      leaves={transformedLeaves}
      pagination={paginationData}
      paginationControls={pagination}
      onLeaveClick={handleLeaveClick}
    />
  );
}


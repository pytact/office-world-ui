// Leave List Container
// SCR_LEAVE_LIST - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { LeaveList } from "./LeaveList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useLeaveListData } from "@/hooks/useLeaveListData";
import { useLeaveContext } from "@/context/LeaveContext";
import { leaveRoutes } from "@/utils/routes";
import { spacing } from "@/theme/tokens";

export function LeaveListContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canCreateLeave } = useLeaveContext();
  const {
    isLoading,
    isError,
    error,
    refetch,
    leaves,
    pagination,
    filters,
    paginationControls,
  } = useLeaveListData();

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: `${spacing[12]} ${spacing[6]}`,
      maxWidth: "800px", // Using fixed maxWidth for centered layout (common pattern)
      margin: "0 auto",
    } as const),
    []
  );

  // Memoized handlers (R14: Performance) - MUST be before early returns (R15 Issue 12)
  const handleLeaveClick = useCallback(
    (leaveId: string) => {
      router.push(leaveRoutes.company.detail(leaveId));
    },
    [router]
  );

  // Loading state (AFTER all hooks)
  if (isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load leave requests"}
        onRetry={refetch}
      />
    );
  }

  // Empty state - R17: Enhanced with clear guidance and next steps
  if (!leaves || leaves.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message={
            filters.hasActiveFilters
              ? "No leave requests match your filters"
              : "No leave requests found"
          }
          description={
            filters.hasActiveFilters
              ? "Try adjusting your search or filter criteria to see more results."
              : canCreateLeave
              ? "Leave requests help you manage time off. Create your first leave request to get started."
              : "No leave requests are available at this time."
          }
          actionText={
            filters.hasActiveFilters
              ? "Clear Filters"
              : canCreateLeave
              ? "Create Your First Leave Request"
              : undefined
          }
          onActionClick={
            filters.hasActiveFilters
              ? filters.resetFilters
              : canCreateLeave
              ? () => router.push(leaveRoutes.company.create)
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <LeaveList
      leaves={leaves}
      filters={filters}
      pagination={pagination}
      paginationControls={paginationControls}
      canCreateLeave={canCreateLeave}
      onLeaveClick={handleLeaveClick}
    />
  );
}


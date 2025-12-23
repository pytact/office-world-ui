// UserListCompany Container
// SCR_USER_LIST_COMPANY - Container component following R7

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserListData } from "@/hooks/useUserListData";
import { Loader, ErrorState, EmptyState } from "@/components/ui";
import { UserListCompany } from "./UserListCompany";
import { useAuthContext } from "@/context";

export function UserListCompanyContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthContext();
  const currentUserRole = currentUser?.role?.toLowerCase() || "";
  const isCEO = currentUserRole === "ceo";
  const isHR = currentUserRole === "hr";
  const canInviteUsers = isCEO || isHR;

  const {
    users,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    paginationControls,
  } = useUserListData({ isPlatform: false });

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users", "company"] });
    router.refresh();
  }, [queryClient, router]);

  // PHASE-UX-4: Flow Continuity - Loading state
  if (isLoading) return <Loader message="Loading users..." />;

  // PHASE-UX-4: Flow Continuity - Error state with recovery
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load users"}
        onRetry={handleRetry}
      />
    );

  // PHASE-UX-4: Flow Continuity - Empty state guides to next action
  if (!users.length && !filters.hasActiveFilters)
    return (
      <EmptyState
        message="No users found"
        description={canInviteUsers 
          ? "Start by inviting a new user to your company."
          : "No users have been added to your company yet."}
        actionText={canInviteUsers ? "Invite User" : undefined}
        onActionClick={canInviteUsers ? () => router.push("/company/users/invite") : undefined}
      />
    );

  // PHASE-UX-4: Flow Continuity - Filtered empty state
  if (!users.length && filters.hasActiveFilters)
    return (
      <EmptyState
        message="No users match your filters"
        description="Try adjusting your search or filters to find users."
        actionText="Reset Filters"
        onActionClick={filters.resetFilters}
      />
    );

  return (
    <UserListCompany
      users={users}
      pagination={pagination}
      filters={filters}
      paginationControls={paginationControls}
    />
  );
}


// UserListPlatform Container
// SCR_USER_LIST_PLATFORM - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useUserListData } from "@/hooks/useUserListData";
import { Loader, ErrorState, EmptyState } from "@/components/ui";
import { UserListPlatform } from "./UserListPlatform";

export function UserListPlatformContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    users,
    isLoading,
    isError,
    error,
    pagination,
    filters,
    paginationControls,
  } = useUserListData({ isPlatform: true });

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users", "platform"] });
    router.refresh();
  }, [queryClient, router]);

  if (isLoading) return <Loader message="Loading users..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load users"}
        onRetry={handleRetry}
      />
    );
  if (!users.length && !filters.hasActiveFilters)
    return <EmptyState message="No users found" />;

  return (
    <UserListPlatform
      users={users}
      pagination={pagination}
      filters={filters}
      paginationControls={paginationControls}
    />
  );
}


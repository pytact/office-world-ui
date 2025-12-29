// UserDetail Container
// SCR_USER_DETAIL - Container component following R7 and R10

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useMappedUser } from "@/hooks/useMappedUser";
import { useParams } from "next/navigation";
import { Loader, ErrorState } from "@/components/ui";
import { UserDetail } from "./UserDetail";

export function UserDetailContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams();
  
  // Try multiple ways to get the ID (Next.js App Router can use different param names)
  const userId = (params?.id || params?.userId || params?.["id"]) as string | null;

  const { user, isLoading, error, isError, etag } = useMappedUser(userId);

  const handleRetry = useCallback(() => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      router.refresh();
    }
  }, [queryClient, router, userId]);

  if (isLoading) {
    return <Loader message="Loading user details..." />;
  }

  if (isError && error) {
    return (
      <ErrorState
        message={error.message || "Failed to load user details"}
        onRetry={handleRetry}
      />
    );
  }

  if (!user) {
    return <ErrorState message="User not found" onRetry={handleRetry} />;
  }

  return <UserDetail user={user} etag={etag} />;
}

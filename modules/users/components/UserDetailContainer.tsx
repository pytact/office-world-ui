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

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[UserDetailContainer] All params:", params);
    console.log("[UserDetailContainer] Extracted User ID:", userId);
    console.log("[UserDetailContainer] Params keys:", Object.keys(params || {}));
  }

  const { user, isLoading, error, isError, etag } = useMappedUser(userId);

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[UserDetailContainer] State:", {
      userId,
      isLoading,
      isError,
      error: error?.message,
      hasUser: !!user,
    });
  }

  const handleRetry = useCallback(() => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      router.refresh();
    }
  }, [queryClient, router, userId]);

  if (isLoading) {
    if (process.env.NODE_ENV === "development") {
      console.log("[UserDetailContainer] Loading user details...");
    }
    return <Loader message="Loading user details..." />;
  }

  if (isError && error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[UserDetailContainer] Error loading user:", error);
    }
    return (
      <ErrorState
        message={error.message || "Failed to load user details"}
        onRetry={handleRetry}
      />
    );
  }

  if (!user) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[UserDetailContainer] User not found for ID:", userId);
    }
    return <ErrorState message="User not found" onRetry={handleRetry} />;
  }

  return <UserDetail user={user} etag={etag} />;
}

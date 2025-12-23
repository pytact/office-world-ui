// Permission View Container
// F-002: RBAC & Permission Engine
// Container component following R7 rules

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { usePermissionContext } from "@/context";
import { Loader, ErrorState } from "@/components/ui";
import { PermissionView } from "./PermissionView";

export function PermissionViewContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { permissions, context, isLoading, error, refreshPermissions } =
    usePermissionContext();

  const handleRetry = useCallback(() => {
    refreshPermissions();
    queryClient.invalidateQueries({ queryKey: ["permission", "me"] });
    router.refresh();
  }, [refreshPermissions, queryClient, router]);

  if (isLoading) return <Loader message="Loading permissions..." />;
  if (error)
    return (
      <ErrorState
        message={error.message || "Failed to load permissions"}
        onRetry={handleRetry}
      />
    );

  return <PermissionView permissions={permissions} context={context} />;
}


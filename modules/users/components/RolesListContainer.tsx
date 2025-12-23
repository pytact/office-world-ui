// Roles List Container
// Container component for displaying all roles
// Following R7: Container component with hooks and business logic

"use client";

import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useRoles } from "@/hooks/useUsers";
import { Loader, ErrorState } from "@/components/ui";
import { RolesList } from "./RolesList";

export function RolesListContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: rolesData, isLoading, isError, error } = useRoles();

  const handleRetry = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["roles"] });
    router.refresh();
  }, [queryClient, router]);

  if (isLoading) return <Loader message="Loading roles..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load roles"}
        onRetry={handleRetry}
      />
    );

  const roles = rolesData?.data?.items || [];

  return <RolesList roles={roles} />;
}


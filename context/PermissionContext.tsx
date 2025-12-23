// Permission Context
// Global permission context provider and custom hook
// F-002: RBAC & Permission Engine

"use client";

import React, { createContext, useContext, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetPermission } from "@/hooks/usePermissions";
import type {
  PermissionSet,
  AuthContextResponse,
} from "@/utils/types/responses/permission";

interface PermissionContextValue {
  permissions: PermissionSet;
  context: AuthContextResponse | null;
  isLoading: boolean;
  error: Error | null;
  refreshPermissions: () => Promise<void>;
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (resource: string, action: string) => boolean;
}

const PermissionContext = createContext<PermissionContextValue | undefined>(
  undefined
);

interface PermissionProviderProps {
  children: React.ReactNode;
}

export function PermissionProvider({ children }: PermissionProviderProps) {
  const queryClient = useQueryClient();
  const { data, isLoading, error, refetch } = useGetPermission();

  const permissions = React.useMemo(
    () => data?.data.permissions || {},
    [data?.data.permissions]
  );

  const context = React.useMemo(
    () => data?.data.context || null,
    [data?.data.context]
  );

  const refreshPermissions = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["permission", "me"] });
    await refetch();
  }, [queryClient, refetch]);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      return permissions[resource]?.includes(action) ?? false;
    },
    [permissions]
  );

  const canAccess = useCallback(
    (resource: string, action: string): boolean => {
      if (!context?.is_user_active) return false;
      if (
        !context.is_super_admin &&
        context.is_company_active !== true
      ) {
        return false;
      }
      return hasPermission(resource, action);
    },
    [context, hasPermission]
  );

  const value: PermissionContextValue = {
    permissions,
    context,
    isLoading,
    error: error as Error | null,
    refreshPermissions,
    hasPermission,
    canAccess,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext(): PermissionContextValue {
  const context = useContext(PermissionContext);

  if (context === undefined) {
    throw new Error(
      "usePermissionContext must be used within a PermissionProvider"
    );
  }

  return context;
}


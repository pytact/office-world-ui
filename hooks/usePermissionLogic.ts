// Permission Business Logic Hooks
// F-002: RBAC & Permission Engine
// Encapsulates permission transformations and business logic
// Following R5 rules: Business logic in hooks

import { useMemo, useCallback } from "react";
import { useGetPermission } from "./usePermissions";
import type {
  PermissionSet,
  AuthContextResponse,
} from "@/utils/types/responses/permission";

interface UsePermissionCheckReturn {
  hasPermission: (resource: string, action: string) => boolean;
  canAccess: (resource: string, action: string) => boolean;
  permissions: PermissionSet;
  isLoading: boolean;
  error: Error | null;
}

export function usePermissionCheck(): UsePermissionCheckReturn {
  const { data, isLoading, error } = useGetPermission();

  const permissions = useMemo(() => {
    return data?.data.permissions || {};
  }, [data?.data.permissions]);

  const hasPermission = useCallback(
    (resource: string, action: string): boolean => {
      return permissions[resource]?.includes(action) ?? false;
    },
    [permissions]
  );

  const canAccess = useCallback(
    (resource: string, action: string): boolean => {
      if (!data?.data.context.is_user_active) return false;
      if (
        !data.data.context.is_super_admin &&
        !data.data.context.is_company_active
      ) {
        return false;
      }
      return hasPermission(resource, action);
    },
    [data?.data.context, hasPermission]
  );

  return {
    hasPermission,
    canAccess,
    permissions,
    isLoading,
    error: error as Error | null,
  };
}

interface PermissionFlags {
  [key: string]: boolean;
}

interface UsePermissionFlagsReturn {
  flags: PermissionFlags;
  getFlag: (resource: string, action: string) => boolean;
  isLoading: boolean;
  error: Error | null;
}

export function usePermissionFlags(): UsePermissionFlagsReturn {
  const { data, isLoading, error } = useGetPermission();

  const flags = useMemo(() => {
    const permissionFlags: PermissionFlags = {};
    const permissions = data?.data.permissions || {};

    Object.entries(permissions).forEach(([resource, actions]) => {
      actions.forEach((action) => {
        permissionFlags[`can_${action}_${resource}`] = true;
      });
    });

    return permissionFlags;
  }, [data?.data.permissions]);

  const getFlag = useCallback(
    (resource: string, action: string): boolean => {
      return flags[`can_${action}_${resource}`] ?? false;
    },
    [flags]
  );

  return {
    flags,
    getFlag,
    isLoading,
    error: error as Error | null,
  };
}

interface UsePermissionContextReturn {
  permissions: PermissionSet;
  context: AuthContextResponse | null;
  isCompanyScoped: boolean;
  hasActiveCompany: boolean;
  isFullyAuthorized: boolean;
  isLoading: boolean;
  error: Error | null;
}

export function usePermissionContext(): UsePermissionContextReturn {
  const { data, isLoading, error } = useGetPermission();

  const permissions = useMemo(() => {
    return data?.data.permissions || {};
  }, [data?.data.permissions]);

  const context = useMemo(() => {
    return data?.data.context || null;
  }, [data?.data.context]);

  const isCompanyScoped = useMemo(() => {
    return !context?.is_super_admin;
  }, [context?.is_super_admin]);

  const hasActiveCompany = useMemo(() => {
    return context?.is_company_active === true;
  }, [context?.is_company_active]);

  const isFullyAuthorized = useMemo(() => {
    if (!context?.is_user_active) return false;
    if (context.is_super_admin) return true;
    return context.is_company_active === true;
  }, [context?.is_user_active, context?.is_super_admin, context?.is_company_active]);

  return {
    permissions,
    context,
    isCompanyScoped,
    hasActiveCompany,
    isFullyAuthorized,
    isLoading,
    error: error as Error | null,
  };
}


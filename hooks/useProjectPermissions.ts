// Project Permissions Hook
// Encapsulates permission checks for project operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";

type UserRole = "ceo" | "manager" | "hr" | "employee";

interface UseProjectPermissionsParams {
  userRole?: UserRole | null;
}

interface UseProjectPermissionsReturn {
  canCreateProject: boolean;
  canUpdateProject: boolean;
  canDeleteProject: boolean;
  canViewAllProjects: boolean;
  isReadOnly: boolean;
}

/**
 * Hook for checking project-related permissions based on user role
 * Encapsulates permission logic following F-007 feature spec
 * @param params - User role information
 * @returns Permission flags for project operations
 */
export function useProjectPermissions(
  params?: UseProjectPermissionsParams
): UseProjectPermissionsReturn {
  const { userRole } = params || {};

  const permissions = useMemo(() => {
    // CEO and Manager have full access
    if (userRole === "ceo" || userRole === "manager") {
      return {
        canCreateProject: true,
        canUpdateProject: true,
        canDeleteProject: true,
        canViewAllProjects: true,
        isReadOnly: false,
      };
    }

    // HR has read-only access to all projects
    if (userRole === "hr") {
      return {
        canCreateProject: false,
        canUpdateProject: false,
        canDeleteProject: false,
        canViewAllProjects: true,
        isReadOnly: true,
      };
    }

    // Employee has read-only access to projects with assigned tasks
    if (userRole === "employee") {
      return {
        canCreateProject: false,
        canUpdateProject: false,
        canDeleteProject: false,
        canViewAllProjects: false, // Only sees projects with assigned tasks
        isReadOnly: true,
      };
    }

    // Default: no permissions
    return {
      canCreateProject: false,
      canUpdateProject: false,
      canDeleteProject: false,
      canViewAllProjects: false,
      isReadOnly: true,
    };
  }, [userRole]);

  return permissions;
}


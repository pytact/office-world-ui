// Task Permissions Hook
// Encapsulates permission checks for task operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { TaskDetail } from "@/utils/types/responses/task";

type UserRole = "ceo" | "manager" | "hr" | "employee";

interface UseTaskPermissionsParams {
  userRole?: UserRole | null;
  task?: TaskDetail | null;
}

interface UseTaskPermissionsReturn {
  canCreateTask: boolean;
  canUpdateTask: boolean;
  canChangeStatus: boolean;
  canManageAssignments: boolean;
  canDeleteTask: boolean;
  canViewAllTasks: boolean;
  isReadOnly: boolean;
}

/**
 * Hook for checking task-related permissions based on user role and task data
 * Encapsulates permission logic following F-008 feature spec
 * @param params - User role and task information
 * @returns Permission flags for task operations
 */
export function useTaskPermissions(
  params?: UseTaskPermissionsParams
): UseTaskPermissionsReturn {
  const { userRole, task } = params || {};

  const permissions = useMemo(() => {
    // CEO and Manager have full control over all company tasks
    if (userRole === "ceo" || userRole === "manager") {
      return {
        canCreateTask: true,
        canUpdateTask: true,
        canChangeStatus: task?.is_owner === true || false, // Only if owner (per domain model)
        canManageAssignments: true, // Can manage assignments for any task
        canDeleteTask: true, // Can delete any company task
        canViewAllTasks: true,
        isReadOnly: false,
      };
    }

    // HR has read-only access to all company tasks
    if (userRole === "hr") {
      return {
        canCreateTask: false,
        canUpdateTask: false,
        canChangeStatus: false,
        canManageAssignments: false,
        canDeleteTask: false,
        canViewAllTasks: true,
        isReadOnly: true,
      };
    }

    // Employee has limited access: own tasks and assigned tasks
    if (userRole === "employee") {
      const isOwner = task?.is_owner === true;
      const canEdit = task?.can_edit_task === true;
      const canChangeStatus = task?.can_change_status === true;
      const canManageAssignments = task?.can_manage_assignments === true;
      const isReadOnly = task?.is_task_read_only === true;

      return {
        canCreateTask: true, // Can create tasks (becomes owner)
        canUpdateTask: canEdit || false,
        canChangeStatus: canChangeStatus || false,
        canManageAssignments: canManageAssignments || false,
        canDeleteTask: isOwner || false, // Can delete only tasks they own
        canViewAllTasks: false, // Only sees own/assigned tasks
        isReadOnly: isReadOnly || false,
      };
    }

    // Default: no permissions
    return {
      canCreateTask: false,
      canUpdateTask: false,
      canChangeStatus: false,
      canManageAssignments: false,
      canDeleteTask: false,
      canViewAllTasks: false,
      isReadOnly: true,
    };
  }, [userRole, task]);

  return permissions;
}


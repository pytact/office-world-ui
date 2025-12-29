// Audit Log Permissions Hook
// Encapsulates permission checks for audit log operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { useAuthContext } from "@/context/AuthContext";

interface UseAuditLogPermissionsReturn {
  canViewAuditLogs: boolean; // Can access audit log list (CEO/HR/Manager only)
  canViewAllAuditLogs: boolean; // Can view all company audit logs (CEO/HR only)
  canViewLimitedAuditLogs: boolean; // Can view only tasks/projects audit logs (Manager only)
  canViewAuditLogDetail: (tableName: string | null) => boolean; // Can view specific audit log detail based on table_name
  allowedTableNames: string[]; // Allowed table names for current user role
}

/**
 * Hook for checking audit log-related permissions based on user role
 * Encapsulates permission logic following F-011 feature spec
 * 
 * Business Rules:
 * - CEO/HR: Can view all audit logs within their company
 * - Manager: Can view only audit logs where table_name ∈ {tasks, projects, task_assignments}
 * - Employee: No access (403 error)
 * - SuperAdmin: Blocked (403 error, out of scope)
 * 
 * @returns Permission flags for audit log operations
 */
export function useAuditLogPermissions(): UseAuditLogPermissionsReturn {
  const { isCEO, isHR, isManager, isEmployee, isSuperAdmin, canAccessAuditLogs } = useAuthContext();

  const permissions = useMemo(() => {
    // Base access check
    const canViewAuditLogs = canAccessAuditLogs;

    // CEO and HR can view all audit logs
    const canViewAllAuditLogs = (isCEO || isHR) && !isSuperAdmin;

    // Manager can view only limited audit logs (tasks/projects/task_assignments)
    const canViewLimitedAuditLogs = isManager && !isSuperAdmin;

    // Allowed table names based on role
    let allowedTableNames: string[] = [];
    if (canViewAllAuditLogs) {
      // CEO/HR can view all tables
      allowedTableNames = []; // Empty array means all tables allowed
    } else if (canViewLimitedAuditLogs) {
      // Manager can only view these tables
      allowedTableNames = ["tasks", "projects", "task_assignments"];
    }
    // Employee and SuperAdmin have no access (empty array)

    // Check if user can view specific audit log detail based on table_name
    const canViewAuditLogDetail = (tableName: string | null): boolean => {
      if (!canViewAuditLogs) return false;
      if (!tableName) return false;

      // CEO/HR can view all
      if (canViewAllAuditLogs) return true;

      // Manager can only view allowed tables
      if (canViewLimitedAuditLogs) {
        return allowedTableNames.includes(tableName);
      }

      return false;
    };

    return {
      canViewAuditLogs,
      canViewAllAuditLogs,
      canViewLimitedAuditLogs,
      canViewAuditLogDetail,
      allowedTableNames,
    };
  }, [isCEO, isHR, isManager, isEmployee, isSuperAdmin, canAccessAuditLogs]);

  return permissions;
}


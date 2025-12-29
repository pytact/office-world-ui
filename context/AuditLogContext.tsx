// Audit Log Context
// Feature-specific audit log context provider and custom hook
// F-011: Audit Logging & Activity History

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useAuditLogPermissions } from "@/hooks/useAuditLogPermissions";

interface AuditLogContextValue {
  // Permissions (from useAuditLogPermissions hook)
  permissions: ReturnType<typeof useAuditLogPermissions>;

  // User role information (from AuthContext)
  userRole: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null;
  userId: string | null; // user_id from AuthContext
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;

  // Computed access flags (role-based)
  canViewAuditLogs: boolean; // Can access audit log list (CEO/HR/Manager only)
  canViewAllAuditLogs: boolean; // Can view all company audit logs (CEO/HR only)
  canViewLimitedAuditLogs: boolean; // Can view only tasks/projects audit logs (Manager only)
  allowedTableNames: string[]; // Allowed table names for current user role
}

const AuditLogContext = createContext<AuditLogContextValue | undefined>(
  undefined
);

interface AuditLogProviderProps {
  children: React.ReactNode;
}

/**
 * Audit Log Context Provider
 * Manages audit log-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useAuditLogPermissions hook for permission logic
 * 
 * Access Control Rules:
 * - CEO/HR: Can view all audit logs within their company
 * - Manager: Can view only audit logs where table_name ∈ {tasks, projects, task_assignments}
 * - Employee: No access (403 error)
 * - SuperAdmin: Blocked (403 error, out of scope)
 * 
 * Note: This is a read-only feature - audit logs are system-generated only
 * No mutations or actions are available from the UI
 */
export function AuditLogProvider({ children }: AuditLogProviderProps) {
  const { user } = useAuthContext();

  // Get user role from AuthContext
  const userRole = useMemo(() => {
    if (!user?.role) return null;
    const role = user.role.toLowerCase();
    if (["superadmin", "ceo", "manager", "hr", "employee"].includes(role)) {
      return role as "superadmin" | "ceo" | "manager" | "hr" | "employee";
    }
    return null;
  }, [user?.role]);

  // Get user ID
  const userId = useMemo(() => {
    return user?.user_id || null;
  }, [user?.user_id]);

  // Get permissions
  const permissions = useAuditLogPermissions();

  // Role flags
  const isSuperAdmin = useMemo(
    () => user?.is_super_admin ?? false,
    [user?.is_super_admin]
  );
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  // Access control flags (from permissions hook)
  const canViewAuditLogs = permissions.canViewAuditLogs;
  const canViewAllAuditLogs = permissions.canViewAllAuditLogs;
  const canViewLimitedAuditLogs = permissions.canViewLimitedAuditLogs;
  const allowedTableNames = permissions.allowedTableNames;

  const value: AuditLogContextValue = {
    permissions,
    userRole,
    userId,
    isSuperAdmin,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canViewAuditLogs,
    canViewAllAuditLogs,
    canViewLimitedAuditLogs,
    allowedTableNames,
  };

  return (
    <AuditLogContext.Provider value={value}>
      {children}
    </AuditLogContext.Provider>
  );
}

/**
 * Custom hook to consume Audit Log Context
 * Must be used within AuditLogProvider
 * Following R6 rules: Context consumed via custom hook
 * 
 * @returns Audit log context value
 * @throws Error if used outside AuditLogProvider
 */
export function useAuditLogContext(): AuditLogContextValue {
  const context = useContext(AuditLogContext);

  if (context === undefined) {
    throw new Error(
      "useAuditLogContext must be used within an AuditLogProvider"
    );
  }

  return context;
}


// Leave Context
// Feature-specific leave context provider and custom hook
// F-009: Leave Management

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useLeavePermissions } from "@/hooks/useLeavePermissions";
import { useGetMe } from "@/hooks/useAuth";

interface LeaveContextValue {
  // Permissions (derived from user role)
  // Note: Leave-specific permissions (can_approve, can_reject, can_cancel) come from leave data
  // This context provides role-based general permissions
  permissions: ReturnType<typeof useLeavePermissions>;

  // User role information (from AuthContext)
  userRole: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null;
  userId: string | null; // user_id from AuthContext
  employeeId: string | null; // employee_id for leave comparisons
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;

  // Computed access flags (role-based, not leave-specific)
  canCreateLeave: boolean;
  canViewAllLeaves: boolean;
  isReadOnly: boolean;
}

const LeaveContext = createContext<LeaveContextValue | undefined>(undefined);

interface LeaveProviderProps {
  children: React.ReactNode;
}

/**
 * Leave Context Provider
 * Manages leave-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useLeavePermissions hook for permission logic
 * 
 * Note: This context provides role-based general permissions.
 * Leave-specific permissions (can_approve, can_reject, can_cancel) are derived
 * from leave data and should be obtained using useLeavePermissions hook with leave data.
 * 
 * For leave data, use the React Query hooks (useListLeaves, useGetLeave, etc.)
 */
export function LeaveProvider({ children }: LeaveProviderProps) {
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

  // Get employee_id from /v1/auth/me endpoint
  // Leave requests use employee_id for comparisons, not user_id
  const meQuery = useGetMe();

  // Get employee_id for current user from /v1/auth/me response
  // employee_id is in user object, not context object
  const employeeId = useMemo(() => {
    if (userRole === "superadmin") return null; // SuperAdmin doesn't have employee record
    return meQuery.data?.data?.user?.employee_id || null;
  }, [meQuery.data?.data?.user?.employee_id, userRole]);

  // Get general permissions based on user role (no specific leave)
  const permissions = useLeavePermissions({ 
    userRole, 
    userId,
    leave: null // General permissions without specific leave data
  });

  // Role flags
  const isSuperAdmin = useMemo(() => user?.is_super_admin ?? false, [user?.is_super_admin]);
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  const value: LeaveContextValue = {
    permissions,
    userRole,
    userId,
    employeeId,
    isSuperAdmin,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canCreateLeave: permissions.canCreateLeave,
    canViewAllLeaves: permissions.canViewAllLeaves,
    isReadOnly: permissions.isReadOnly,
  };

  return (
    <LeaveContext.Provider value={value}>
      {children}
    </LeaveContext.Provider>
  );
}

/**
 * Custom hook to consume Leave Context
 * Must be used within LeaveProvider
 * Following R6 rules: Context consumed via custom hook
 * 
 * @returns Leave context value
 * @throws Error if used outside LeaveProvider
 */
export function useLeaveContext(): LeaveContextValue {
  const context = useContext(LeaveContext);

  if (context === undefined) {
    throw new Error(
      "useLeaveContext must be used within a LeaveProvider"
    );
  }

  return context;
}


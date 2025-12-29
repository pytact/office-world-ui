// Attendance Context
// Feature-specific attendance context provider and custom hook
// F-010: Attendance Management

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useAttendancePermissions } from "@/hooks/useAttendancePermissions";
import { useGetMe } from "@/hooks/useAuth";

interface AttendanceContextValue {
  // Permissions (derived from attendance status)
  // Note: Attendance-specific permissions (can_check_in, can_check_out) come from attendance data
  // This context provides role-based general permissions
  permissions: ReturnType<typeof useAttendancePermissions>;

  // User role information (from AuthContext)
  userRole: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null;
  userId: string | null; // user_id from AuthContext
  employeeId: string | null; // employee_id for attendance comparisons
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;

  // Computed access flags (role-based, not attendance-specific)
  canCheckInOut: boolean; // Can perform check-in/check-out (Employee, Manager, HR, CEO - not SuperAdmin)
  canViewCompanyAttendance: boolean; // Can view company attendance list (Manager, HR, CEO only)
  canViewCompanyDetail: boolean; // Can view company attendance detail (Manager, HR, CEO only)
  isReadOnly: boolean; // Read-only access (SuperAdmin or deactivated employees)
}

const AttendanceContext = createContext<AttendanceContextValue | undefined>(
  undefined
);

interface AttendanceProviderProps {
  children: React.ReactNode;
}

/**
 * Attendance Context Provider
 * Manages attendance-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useAttendancePermissions hook for permission logic
 * 
 * Note: This context provides role-based general permissions.
 * Attendance-specific permissions (can_check_in, can_check_out) are derived
 * from attendance status and should be obtained using useAttendancePermissions hook with attendance data.
 * 
 * For attendance data, use the React Query hooks (useAttendanceToday, useAttendanceHistory, etc.)
 * 
 * Access Control Rules:
 * - Employee: Can view own attendance only, can check-in/out for themselves
 * - Manager: Can view own attendance + employees in scope, can check-in/out for themselves
 * - HR/CEO: Can view own attendance + full company, can check-in/out for themselves
 * - SuperAdmin: Explicitly excluded from all attendance features (isReadOnly = true)
 * - Deactivated Employees: Cannot access attendance features (isReadOnly = true)
 */
export function AttendanceProvider({ children }: AttendanceProviderProps) {
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
  // Attendance uses employee_id for comparisons
  const meQuery = useGetMe();

  // Get employee_id for current user from /v1/auth/me response
  const employeeId = useMemo(() => {
    if (userRole === "superadmin") return null; // SuperAdmin doesn't have employee record
    return meQuery.data?.data?.user?.employee_id || null;
  }, [meQuery.data?.data?.user?.employee_id, userRole]);

  // Get general permissions based on user role (no specific attendance)
  const permissions = useAttendancePermissions({
    attendance: null, // General permissions without specific attendance data
  });

  // Role flags
  const isSuperAdmin = useMemo(
    () => user?.is_super_admin ?? false,
    [user?.is_super_admin]
  );
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  // Access control flags
  // SuperAdmin is explicitly excluded from all attendance features
  const canCheckInOut = useMemo(() => {
    return !isSuperAdmin && (isEmployee || isManager || isHR || isCEO);
  }, [isSuperAdmin, isEmployee, isManager, isHR, isCEO]);

  // Manager, HR, CEO can view company attendance list
  const canViewCompanyAttendance = useMemo(() => {
    return !isSuperAdmin && (isManager || isHR || isCEO);
  }, [isSuperAdmin, isManager, isHR, isCEO]);

  // Manager, HR, CEO can view company attendance detail
  const canViewCompanyDetail = useMemo(() => {
    return !isSuperAdmin && (isManager || isHR || isCEO);
  }, [isSuperAdmin, isManager, isHR, isCEO]);

  // Read-only access for SuperAdmin or deactivated employees
  const isReadOnly = useMemo(() => {
    return isSuperAdmin || !canCheckInOut;
  }, [isSuperAdmin, canCheckInOut]);

  const value: AttendanceContextValue = {
    permissions,
    userRole,
    userId,
    employeeId,
    isSuperAdmin,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canCheckInOut,
    canViewCompanyAttendance,
    canViewCompanyDetail,
    isReadOnly,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
}

/**
 * Custom hook to consume Attendance Context
 * Must be used within AttendanceProvider
 * Following R6 rules: Context consumed via custom hook
 * 
 * @returns Attendance context value
 * @throws Error if used outside AttendanceProvider
 */
export function useAttendanceContext(): AttendanceContextValue {
  const context = useContext(AttendanceContext);

  if (context === undefined) {
    throw new Error(
      "useAttendanceContext must be used within an AttendanceProvider"
    );
  }

  return context;
}


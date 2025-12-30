// Report Context
// Feature-specific report context provider and custom hook
// F-012: Reports & Analytics

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useReportPermissions } from "@/hooks/useReportPermissions";
import { ReportType } from "@/utils/types/requests/report";

interface ReportContextValue {
  // Permissions (from useReportPermissions hook)
  permissions: ReturnType<typeof useReportPermissions>;

  // User role information (from AuthContext)
  userRole: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null;
  userId: string | null; // user_id from AuthContext
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;

  // Computed access flags (role-based)
  canAccessReports: boolean; // Can access reports feature (all roles except SuperAdmin)
  canViewAllReports: boolean; // Can view all report types (CEO/HR only)
  canViewLimitedReports: boolean; // Can view limited reports (Manager/Employee)
  isReadOnly: boolean; // Reports are always read-only (true for all)

  // Report type access flags
  canViewAttendanceReport: boolean;
  canViewLeaveReport: boolean;
  canViewSalarySummaryReport: boolean; // CEO/HR only
  canViewEmployeeReport: boolean; // CEO/HR only
  canViewTaskReport: boolean;
  canViewProjectReport: boolean; // Manager/HR/CEO only
  canViewAuditSummaryReport: boolean; // CEO/HR only

  // Export permissions
  canExportReports: boolean;
  canExportAllReports: boolean;
  canExportLimitedReports: boolean;

  // Helper function to check access to specific report type
  canAccessReportType: (reportType: ReportType) => boolean;

  // Accessible report types for current role
  accessibleReportTypes: ReportType[];
}

const ReportContext = createContext<ReportContextValue | undefined>(undefined);

interface ReportProviderProps {
  children: React.ReactNode;
}

/**
 * Report Context Provider
 * Manages report-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useReportPermissions hook for permission logic
 * 
 * Access Control Rules (from F-012 domain model):
 * - CEO: All report types (company-scoped)
 * - HR: All report types (company-scoped)
 * - Manager: ATTENDANCE, PROJECT, TASK (company-scoped)
 * - Employee: Own ATTENDANCE, LEAVE, TASK (self-scoped)
 * - SuperAdmin: No access (blocked by BR-1203)
 * 
 * Reports are read-only derived models - no create, update, or delete operations
 * Export operations are the only write operations and follow the same access rules
 * 
 * Note: Reports are company-scoped - all data is filtered by org_id from JWT token
 * Employee role has self-scoped access (can only see own data)
 */
export function ReportProvider({ children }: ReportProviderProps) {
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
  const permissions = useReportPermissions();

  // Role flags
  const isSuperAdmin = useMemo(
    () => user?.is_super_admin ?? false,
    [user?.is_super_admin]
  );
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  const value: ReportContextValue = {
    permissions,
    userRole,
    userId,
    isSuperAdmin,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canAccessReports: permissions.canAccessReports,
    canViewAllReports: permissions.canViewAllReports,
    canViewLimitedReports: permissions.canViewLimitedReports,
    isReadOnly: permissions.isReadOnly,
    canViewAttendanceReport: permissions.canViewAttendanceReport,
    canViewLeaveReport: permissions.canViewLeaveReport,
    canViewSalarySummaryReport: permissions.canViewSalarySummaryReport,
    canViewEmployeeReport: permissions.canViewEmployeeReport,
    canViewTaskReport: permissions.canViewTaskReport,
    canViewProjectReport: permissions.canViewProjectReport,
    canViewAuditSummaryReport: permissions.canViewAuditSummaryReport,
    canExportReports: permissions.canExportReports,
    canExportAllReports: permissions.canExportAllReports,
    canExportLimitedReports: permissions.canExportLimitedReports,
    canAccessReportType: permissions.canAccessReportType,
    accessibleReportTypes: permissions.accessibleReportTypes,
  };

  return (
    <ReportContext.Provider value={value}>
      {children}
    </ReportContext.Provider>
  );
}

/**
 * Custom hook to consume Report Context
 * Must be used within ReportProvider
 * Following R6 rules: Context consumed via custom hook
 * 
 * @returns Report context value
 * @throws Error if used outside ReportProvider
 */
export function useReportContext(): ReportContextValue {
  const context = useContext(ReportContext);

  if (context === undefined) {
    throw new Error(
      "useReportContext must be used within a ReportProvider"
    );
  }

  return context;
}


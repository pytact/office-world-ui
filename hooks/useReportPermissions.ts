// Report Permissions Hook
// Encapsulates permission checks for report operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { ReportType } from "@/utils/types/requests/report";

interface UseReportPermissionsReturn {
  // Base access flags
  canAccessReports: boolean; // Can access reports feature (all roles except SuperAdmin)
  canViewAllReports: boolean; // Can view all report types (CEO/HR only)
  canViewLimitedReports: boolean; // Can view limited reports (Manager/Employee)
  isReadOnly: boolean; // Reports are always read-only (true for all)

  // Report type access checks
  canViewAttendanceReport: boolean;
  canViewLeaveReport: boolean;
  canViewSalarySummaryReport: boolean; // CEO/HR only
  canViewEmployeeReport: boolean; // CEO/HR only
  canViewTaskReport: boolean;
  canViewProjectReport: boolean; // Manager/HR/CEO only
  canViewAuditSummaryReport: boolean; // CEO/HR only

  // Export permissions (same as view permissions)
  canExportReports: boolean;
  canExportAllReports: boolean;
  canExportLimitedReports: boolean;

  // Helper function to check access to specific report type
  canAccessReportType: (reportType: ReportType) => boolean;

  // Accessible report types for current role
  accessibleReportTypes: ReportType[];
}

/**
 * Hook for checking report-related permissions based on user role
 * Encapsulates permission logic following F-012 feature spec
 * 
 * Business Rules (from F-012 domain model):
 * - CEO: All report types (company-scoped)
 * - HR: All report types (company-scoped)
 * - Manager: ATTENDANCE, PROJECT, TASK (company-scoped)
 * - Employee: Own ATTENDANCE, LEAVE, TASK (self-scoped)
 * - SuperAdmin: No access (blocked by BR-1203)
 * 
 * Reports are read-only - no create, update, or delete operations
 * Export operations follow the same access rules as view operations
 * 
 * @returns Permission flags for report operations
 */
export function useReportPermissions(): UseReportPermissionsReturn {
  const {
    isCEO,
    isHR,
    isManager,
    isEmployee,
    isSuperAdmin,
  } = useAuthContext();

  const permissions = useMemo(() => {
    // SuperAdmin has no access to reports (blocked by BR-1203)
    if (isSuperAdmin) {
      return {
        canAccessReports: false,
        canViewAllReports: false,
        canViewLimitedReports: false,
        isReadOnly: true,
        canViewAttendanceReport: false,
        canViewLeaveReport: false,
        canViewSalarySummaryReport: false,
        canViewEmployeeReport: false,
        canViewTaskReport: false,
        canViewProjectReport: false,
        canViewAuditSummaryReport: false,
        canExportReports: false,
        canExportAllReports: false,
        canExportLimitedReports: false,
        canAccessReportType: () => false,
        accessibleReportTypes: [] as ReportType[],
      };
    }

    // CEO and HR have access to all report types
    const canViewAllReports = (isCEO || isHR) && !isSuperAdmin;

    // Manager has access to limited reports (ATTENDANCE, PROJECT, TASK)
    const canViewLimitedReports = isManager && !isSuperAdmin;

    // Employee has access to own reports (ATTENDANCE, LEAVE, TASK - self-scoped)
    const canViewEmployeeReports = isEmployee && !isSuperAdmin;

    // Base access check
    const canAccessReports =
      canViewAllReports || canViewLimitedReports || canViewEmployeeReports;

    // Report type access flags
    const canViewAttendanceReport =
      canViewAllReports || canViewLimitedReports || canViewEmployeeReports;
    const canViewLeaveReport = canViewAllReports || canViewEmployeeReports;
    const canViewSalarySummaryReport = canViewAllReports; // CEO/HR only
    const canViewEmployeeReport = canViewAllReports; // CEO/HR only
    const canViewTaskReport =
      canViewAllReports || canViewLimitedReports || canViewEmployeeReports;
    const canViewProjectReport = canViewAllReports || canViewLimitedReports; // Manager/HR/CEO
    const canViewAuditSummaryReport = canViewAllReports; // CEO/HR only

    // Export permissions (same as view permissions)
    const canExportReports = canAccessReports;
    const canExportAllReports = canViewAllReports;
    const canExportLimitedReports = canViewLimitedReports || canViewEmployeeReports;

    // Helper function to check access to specific report type
    const canAccessReportType = (reportType: ReportType): boolean => {
      switch (reportType) {
        case "ATTENDANCE":
          return canViewAttendanceReport;
        case "LEAVE":
          return canViewLeaveReport;
        case "SALARY_SUMMARY":
          return canViewSalarySummaryReport;
        case "EMPLOYEE":
          return canViewEmployeeReport;
        case "TASK":
          return canViewTaskReport;
        case "PROJECT":
          return canViewProjectReport;
        case "AUDIT_SUMMARY":
          return canViewAuditSummaryReport;
        default:
          return false;
      }
    };

    // Accessible report types for current role
    const accessibleReportTypes: ReportType[] = [];
    if (canViewAllReports) {
      // CEO/HR: All report types
      accessibleReportTypes.push(
        "ATTENDANCE",
        "LEAVE",
        "SALARY_SUMMARY",
        "EMPLOYEE",
        "TASK",
        "PROJECT",
        "AUDIT_SUMMARY"
      );
    } else if (canViewLimitedReports) {
      // Manager: ATTENDANCE, PROJECT, TASK
      accessibleReportTypes.push("ATTENDANCE", "PROJECT", "TASK");
    } else if (canViewEmployeeReports) {
      // Employee: Own ATTENDANCE, LEAVE, TASK
      accessibleReportTypes.push("ATTENDANCE", "LEAVE", "TASK");
    }

    return {
      canAccessReports,
      canViewAllReports,
      canViewLimitedReports: canViewLimitedReports || canViewEmployeeReports,
      isReadOnly: true, // Reports are always read-only
      canViewAttendanceReport,
      canViewLeaveReport,
      canViewSalarySummaryReport,
      canViewEmployeeReport,
      canViewTaskReport,
      canViewProjectReport,
      canViewAuditSummaryReport,
      canExportReports,
      canExportAllReports,
      canExportLimitedReports,
      canAccessReportType,
      accessibleReportTypes,
    };
  }, [isCEO, isHR, isManager, isEmployee, isSuperAdmin]);

  return permissions;
}


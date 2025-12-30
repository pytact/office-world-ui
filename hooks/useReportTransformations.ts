// Report Transformations Hook
// Encapsulates data transformations for report display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";

/**
 * Formats ISO 8601 UTC datetime string to local display format
 * Example: "2024-01-20T10:30:00Z" -> "Jan 20, 2024, 10:30 AM"
 * Converts UTC to local timezone for display
 */
export function formatReportDateTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats ISO 8601 date-only string to display format
 * Example: "2024-01-20" -> "January 20, 2024" or "01/20/2024"
 */
export function formatReportDate(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString + "T00:00:00Z"); // Parse as UTC date
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats ISO 8601 date-only string to short format
 * Example: "2024-01-20" -> "Jan 20, 2024"
 */
export function formatReportDateShort(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString + "T00:00:00Z");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats date range for display
 * Example: "Jan 1 - Jan 31, 2024" or "January 2024"
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  if (!startDate || !endDate) return "—";
  try {
    const start = new Date(startDate + "T00:00:00Z");
    const end = new Date(endDate + "T00:00:00Z");

    // If same month and year, show: "Jan 1-31, 2024"
    if (
      start.getUTCFullYear() === end.getUTCFullYear() &&
      start.getUTCMonth() === end.getUTCMonth()
    ) {
      const month = start.toLocaleDateString("en-US", { month: "short" });
      const year = start.getUTCFullYear();
      return `${month} ${start.getUTCDate()}-${end.getUTCDate()}, ${year}`;
    }

    // Otherwise show: "Jan 1 - Jan 31, 2024"
    const startFormatted = formatReportDateShort(startDate);
    const endFormatted = formatReportDateShort(endDate);
    return `${startFormatted} - ${endFormatted}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

/**
 * Formats currency value for display
 * Example: 5000000.00 -> "$5,000,000.00" or "5,000,000.00 USD"
 */
export function formatCurrency(
  value: number | null | undefined,
  currency: string = "USD"
): string {
  if (value === null || value === undefined) return "—";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

/**
 * Formats decimal hours to display format
 * Example: 8.5 -> "8.5 hours" or "8h 30m"
 */
export function formatHours(
  hours: number | null | undefined,
  format: "decimal" | "hours-minutes" = "decimal"
): string {
  if (hours === null || hours === undefined) return "—";
  if (format === "decimal") {
    return `${hours} hour${hours !== 1 ? "s" : ""}`;
  }

  // Format as hours and minutes
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);
  if (minutes === 0) {
    return `${wholeHours}h`;
  }
  return `${wholeHours}h ${minutes}m`;
}

/**
 * Formats percentage for display
 * Example: 60 -> "60%" or "60% Complete"
 */
export function formatPercentage(
  value: number | null | undefined,
  suffix: string = ""
): string {
  if (value === null || value === undefined) return "—";
  const formatted = `${value}%`;
  return suffix ? `${formatted} ${suffix}` : formatted;
}

/**
 * Formats integer count for display
 * Example: 150 -> "150" or "150 employees"
 */
export function formatCount(
  value: number | null | undefined,
  label: string = ""
): string {
  if (value === null || value === undefined) return "—";
  const formatted = value.toLocaleString("en-US");
  return label ? `${formatted} ${label}` : formatted;
}

// Status Label Mappings
// Maps status codes to human-readable labels for different report types

const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LATE: "Late",
  HALF_DAY: "Half Day",
};

const LEAVE_STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  CANCELLED: "Cancelled",
};

const TASK_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PROJECT_STATUS_LABELS: Record<string, string> = {
  PLANNING: "Planning",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ON_HOLD: "On Hold",
};

const EMPLOYEE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  TERMINATED: "Terminated",
};

const AUDIT_STATUS_LABELS: Record<string, string> = {
  SUCCESS: "Success",
  FAILURE: "Failure",
  ERROR: "Error",
};

/**
 * Formats status code to human-readable label
 * @param status - Status code
 * @param reportType - Report type for context-specific labels
 * @returns Formatted status label
 */
export function formatStatus(
  status: string | null | undefined,
  reportType?: string
): string {
  if (!status) return "—";

  let label: string | undefined;

  switch (reportType) {
    case "ATTENDANCE":
      label = ATTENDANCE_STATUS_LABELS[status];
      break;
    case "LEAVE":
      label = LEAVE_STATUS_LABELS[status];
      break;
    case "TASK":
      label = TASK_STATUS_LABELS[status];
      break;
    case "PROJECT":
      label = PROJECT_STATUS_LABELS[status];
      break;
    case "EMPLOYEE":
      label = EMPLOYEE_STATUS_LABELS[status];
      break;
    case "AUDIT_SUMMARY":
      label = AUDIT_STATUS_LABELS[status];
      break;
    default:
      // Fallback: convert snake_case to Title Case
      label = status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
  }

  return label || status;
}

/**
 * Gets status badge color/variant for UI
 * @param status - Status code
 * @param reportType - Report type for context-specific colors
 * @returns Badge color variant
 */
export function getStatusBadgeColor(
  status: string | null | undefined,
  reportType?: string
): "success" | "warning" | "error" | "info" | "default" {
  if (!status) return "default";

  // Common status color mappings
  const successStatuses = ["PRESENT", "APPROVED", "COMPLETED", "ACTIVE", "SUCCESS"];
  const warningStatuses = ["LATE", "APPLIED", "IN_PROGRESS", "PLANNING", "ON_HOLD"];
  const errorStatuses = ["ABSENT", "REJECTED", "CANCELLED", "TERMINATED", "FAILURE", "ERROR"];

  if (successStatuses.includes(status)) return "success";
  if (warningStatuses.includes(status)) return "warning";
  if (errorStatuses.includes(status)) return "error";
  return "default";
}

/**
 * Formats employee ID to name lookup
 * Uses filter_options.employees array from report metadata
 * @param employeeId - Employee ID (UUID)
 * @param employees - Array of employee filter options
 * @returns Employee name or ID if not found
 */
export function formatEmployeeName(
  employeeId: string | null | undefined,
  employees?: Array<{ employee_id: string; name: string }> | null
): string {
  if (!employeeId) return "—";
  if (!employees || employees.length === 0) return employeeId;

  const employee = employees.find((emp) => emp.employee_id === employeeId);
  return employee?.name || employeeId;
}

/**
 * Formats project ID to name lookup
 * Uses filter_options.projects array from report metadata
 * @param projectId - Project ID (UUID)
 * @param projects - Array of project filter options
 * @returns Project name or ID if not found
 */
export function formatProjectName(
  projectId: string | null | undefined,
  projects?: Array<{ project_id: string; name: string }> | null
): string {
  if (!projectId) return "—";
  if (!projects || projects.length === 0) return projectId;

  const project = projects.find((proj) => proj.project_id === projectId);
  return project?.name || projectId;
}

/**
 * Formats period string (YYYY-MM) to display format
 * Example: "2024-01" -> "January 2024"
 */
export function formatPeriod(
  period: string | null | undefined
): string {
  if (!period) return "—";
  try {
    const [year, month] = period.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  } catch {
    return period;
  }
}

/**
 * Hook for transforming report data
 * Applies all formatting transformations to report rows
 * 
 * @param rows - Array of report row data
 * @param reportType - Report type for context-specific transformations
 * @param filterOptions - Filter options for name lookups
 * @returns Transformed report rows
 */
export function useReportTransformations<T extends Record<string, unknown>>(
  rows: T[] | null | undefined,
  reportType?: string,
  filterOptions?: {
    employees?: Array<{ employee_id: string; name: string }> | null;
    projects?: Array<{ project_id: string; name: string }> | null;
  }
) {
  return useMemo(() => {
    if (!rows || rows.length === 0) return [];

    return rows.map((row) => {
      const transformed = { ...row };

      // Transform date fields
      if (row.date) {
        (transformed as Record<string, unknown>).dateFormatted = formatReportDate(
          row.date as string
        );
      }
      if (row.start_date) {
        (transformed as Record<string, unknown>).startDateFormatted = formatReportDate(
          row.start_date as string
        );
      }
      if (row.end_date) {
        (transformed as Record<string, unknown>).endDateFormatted = formatReportDate(
          row.end_date as string
        );
      }
      if (row.due_date) {
        (transformed as Record<string, unknown>).dueDateFormatted = formatReportDate(
          row.due_date as string
        );
      }
      if (row.hire_date) {
        (transformed as Record<string, unknown>).hireDateFormatted = formatReportDate(
          row.hire_date as string
        );
      }
      if (row.timestamp) {
        (transformed as Record<string, unknown>).timestampFormatted = formatReportDateTime(
          row.timestamp as string
        );
      }
      if (row.check_in_time) {
        (transformed as Record<string, unknown>).checkInTimeFormatted = formatReportDateTime(
          row.check_in_time as string
        );
      }
      if (row.check_out_time) {
        (transformed as Record<string, unknown>).checkOutTimeFormatted = formatReportDateTime(
          row.check_out_time as string
        );
      }
      if (row.applied_date) {
        (transformed as Record<string, unknown>).appliedDateFormatted = formatReportDateTime(
          row.applied_date as string
        );
      }

      // Transform status fields
      if (row.status) {
        (transformed as Record<string, unknown>).statusLabel = formatStatus(
          row.status as string,
          reportType
        );
        (transformed as Record<string, unknown>).statusBadgeColor = getStatusBadgeColor(
          row.status as string,
          reportType
        );
      }

      // Transform employee name lookups
      if (row.employee_id && filterOptions?.employees) {
        (transformed as Record<string, unknown>).employeeNameFormatted = formatEmployeeName(
          row.employee_id as string,
          filterOptions.employees
        );
      }
      if (row.assigned_to && filterOptions?.employees) {
        (transformed as Record<string, unknown>).assignedToNameFormatted = formatEmployeeName(
          row.assigned_to as string,
          filterOptions.employees
        );
      }

      // Transform project name lookups
      if (row.project_id && filterOptions?.projects) {
        (transformed as Record<string, unknown>).projectNameFormatted = formatProjectName(
          row.project_id as string,
          filterOptions.projects
        );
      }

      // Transform numeric fields
      if (typeof row.hours_worked === "number") {
        (transformed as Record<string, unknown>).hoursWorkedFormatted = formatHours(
          row.hours_worked
        );
      }
      if (typeof row.progress === "number") {
        (transformed as Record<string, unknown>).progressFormatted = formatPercentage(
          row.progress
        );
      }
      if (typeof row.days === "number") {
        (transformed as Record<string, unknown>).daysFormatted = formatCount(
          row.days,
          "day" + (row.days !== 1 ? "s" : "")
        );
      }

      return transformed;
    });
  }, [rows, reportType, filterOptions]);
}


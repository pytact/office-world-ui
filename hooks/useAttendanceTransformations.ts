// Attendance Transformations Hook
// Encapsulates data transformations for attendance display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  AttendanceResponse,
  AttendanceSummary,
  CompanyAttendanceSummary,
  AttendanceLogResponse,
  AttendanceEmployeeSummary,
} from "@/utils/types/responses/attendance";
import { AttendanceStatus } from "@/utils/types/requests/attendance";

// Status Label Mappings
const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  NOT_STARTED: "Not Started",
  CHECKED_IN: "Checked In",
  CHECKED_OUT: "Checked Out",
};

// Status Color Mappings
const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  NOT_STARTED: "gray",
  CHECKED_IN: "blue",
  CHECKED_OUT: "green",
};

// Action Type Label Mappings
const ACTION_TYPE_LABELS: Record<
  "CHECK_IN" | "CHECK_OUT" | "AUTO_CHECK_OUT",
  string
> = {
  CHECK_IN: "Check In",
  CHECK_OUT: "Check Out",
  AUTO_CHECK_OUT: "Auto Check Out",
};

// Transformation Functions
export function getAttendanceStatusLabel(
  status: AttendanceStatus | null | undefined
): string {
  if (!status) return "—";
  return ATTENDANCE_STATUS_LABELS[status] || status;
}

export function getAttendanceStatusColor(
  status: AttendanceStatus | null | undefined
): string {
  if (!status) return "gray";
  return ATTENDANCE_STATUS_COLORS[status] || "gray";
}

export function getActionTypeLabel(
  actionType: "CHECK_IN" | "CHECK_OUT" | "AUTO_CHECK_OUT" | null | undefined
): string {
  if (!actionType) return "—";
  return ACTION_TYPE_LABELS[actionType] || actionType;
}

/**
 * Formats employee name from first_name and last_name
 */
export function formatEmployeeName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  if (!firstName && !lastName) return "—";
  if (!firstName) return lastName || "—";
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
}

/**
 * Formats ISO 8601 date string to user-friendly format
 * Example: "2024-01-20" -> "Jan 20, 2024"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString + "T00:00:00");
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
 * Formats ISO 8601 datetime string to user-friendly format in local timezone
 * Example: "2024-01-20T09:12:00Z" -> "Jan 20, 2024, 09:12 AM"
 * Note: Converts UTC to local timezone for display
 */
export function formatDateTime(
  dateString: string | null | undefined,
  timezone?: string
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    
    // Use Intl.DateTimeFormat if timezone is provided
    if (timezone) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }).format(date);
    }
    
    // Default to local timezone
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
 * Formats ISO 8601 datetime string to time only in local timezone
 * Example: "2024-01-20T09:12:00Z" -> "09:12 AM"
 */
export function formatTime(
  dateString: string | null | undefined,
  timezone?: string
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    
    // Use Intl.DateTimeFormat if timezone is provided
    if (timezone) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: timezone,
      }).format(date);
    }
    
    // Default to local timezone
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats worked time string or displays fallback
 * Example: "9h 29m" -> "9h 29m" or null -> "N/A"
 */
export function formatWorkedTime(
  workedTime: string | null | undefined
): string {
  if (!workedTime) return "N/A";
  return workedTime;
}

/**
 * Formats ISO 8601 datetime string to relative time
 * Example: "2 hours ago", "3 days ago", or absolute date if older
 */
export function formatRelativeTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }

    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

// Transformed Attendance Summary
export interface TransformedAttendanceSummary {
  id: string;
  attendance_date: string;
  attendanceDateFormatted: string;
  check_in_time: string | null;
  checkInTimeFormatted: string | null;
  check_out_time: string | null;
  checkOutTimeFormatted: string | null;
  status: AttendanceStatus;
  statusLabel: string;
  statusColor: string;
  worked_time: string | null;
  workedTimeFormatted: string;
  is_auto_check_out: boolean;
}

// Transformed Company Attendance Summary
export interface TransformedCompanyAttendanceSummary {
  id: string;
  employee: AttendanceEmployeeSummary & {
    fullName: string;
  };
  attendance_date: string;
  attendanceDateFormatted: string;
  status: AttendanceStatus;
  statusLabel: string;
  statusColor: string;
  worked_time: string | null;
  workedTimeFormatted: string;
  is_auto_check_out: boolean;
}

// Transformed Attendance Response
export interface TransformedAttendanceResponse extends AttendanceResponse {
  attendanceDateFormatted: string;
  checkInTimeFormatted: string | null;
  checkOutTimeFormatted: string | null;
  statusLabel: string;
  statusColor: string;
  workedTimeFormatted: string;
}

// Transformed Attendance Log
export interface TransformedAttendanceLog {
  id: string;
  action_type: "CHECK_IN" | "CHECK_OUT" | "AUTO_CHECK_OUT";
  actionTypeLabel: string;
  action_time: string;
  actionTimeFormatted: string;
  actionTimeRelative: string;
  location: string | null;
  ip_address: string | null;
  device_info: string | null;
  notes: string | null;
  is_auto_action: boolean;
}

/**
 * Transform a single attendance summary for display
 */
export function transformAttendanceSummary(
  attendance: AttendanceSummary,
  timezone?: string
): TransformedAttendanceSummary {
  return {
    ...attendance,
    attendanceDateFormatted: formatDate(attendance.attendance_date),
    checkInTimeFormatted: formatTime(attendance.check_in_time, timezone),
    checkOutTimeFormatted: formatTime(attendance.check_out_time, timezone),
    statusLabel: getAttendanceStatusLabel(attendance.status),
    statusColor: getAttendanceStatusColor(attendance.status),
    workedTimeFormatted: formatWorkedTime(attendance.worked_time),
  };
}

/**
 * Transform a single company attendance summary for display
 */
export function transformCompanyAttendanceSummary(
  attendance: CompanyAttendanceSummary,
  timezone?: string
): TransformedCompanyAttendanceSummary {
  return {
    ...attendance,
    employee: {
      ...attendance.employee,
      fullName: formatEmployeeName(
        attendance.employee.first_name,
        attendance.employee.last_name
      ),
    },
    attendanceDateFormatted: formatDate(attendance.attendance_date),
    statusLabel: getAttendanceStatusLabel(attendance.status),
    statusColor: getAttendanceStatusColor(attendance.status),
    workedTimeFormatted: formatWorkedTime(attendance.worked_time),
  };
}

/**
 * Transform a single attendance response for display
 */
export function transformAttendanceResponse(
  attendance: AttendanceResponse,
  timezone?: string
): TransformedAttendanceResponse {
  return {
    ...attendance,
    attendanceDateFormatted: formatDate(attendance.attendance_date),
    checkInTimeFormatted: formatDateTime(attendance.check_in_time, timezone),
    checkOutTimeFormatted: formatDateTime(attendance.check_out_time, timezone),
    statusLabel: getAttendanceStatusLabel(attendance.status),
    statusColor: getAttendanceStatusColor(attendance.status),
    workedTimeFormatted: formatWorkedTime(attendance.worked_time),
  };
}

/**
 * Transform a single attendance log for display
 */
export function transformAttendanceLog(
  log: AttendanceLogResponse,
  timezone?: string
): TransformedAttendanceLog {
  return {
    ...log,
    actionTypeLabel: getActionTypeLabel(log.action_type),
    actionTimeFormatted: formatDateTime(log.action_time, timezone),
    actionTimeRelative: formatRelativeTime(log.action_time),
  };
}

/**
 * Hook for transforming attendance summaries
 * @param summaries - Array of attendance summaries
 * @param timezone - Optional timezone for time conversion (IANA format)
 * @returns Transformed attendance summaries
 */
export function useAttendanceTransformations(
  summaries: AttendanceSummary[],
  timezone?: string
): TransformedAttendanceSummary[] {
  return useMemo(() => {
    return summaries.map((summary) =>
      transformAttendanceSummary(summary, timezone)
    );
  }, [summaries, timezone]);
}

/**
 * Hook for transforming company attendance summaries
 * @param summaries - Array of company attendance summaries
 * @param timezone - Optional timezone for time conversion (IANA format)
 * @returns Transformed company attendance summaries
 */
export function useCompanyAttendanceTransformations(
  summaries: CompanyAttendanceSummary[],
  timezone?: string
): TransformedCompanyAttendanceSummary[] {
  return useMemo(() => {
    return summaries.map((summary) =>
      transformCompanyAttendanceSummary(summary, timezone)
    );
  }, [summaries, timezone]);
}

/**
 * Hook for transforming attendance logs
 * @param logs - Array of attendance logs
 * @param timezone - Optional timezone for time conversion (IANA format)
 * @returns Transformed attendance logs
 */
export function useAttendanceLogTransformations(
  logs: AttendanceLogResponse[],
  timezone?: string
): TransformedAttendanceLog[] {
  return useMemo(() => {
    return logs.map((log) => transformAttendanceLog(log, timezone));
  }, [logs, timezone]);
}


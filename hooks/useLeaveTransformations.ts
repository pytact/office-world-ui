// Leave Transformations Hook
// Encapsulates data transformations for leave display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  LeaveSummary,
  LeaveDetail,
} from "@/utils/types/responses/leave";
import { LeaveStatus, LeaveType, DayType } from "@/utils/types/requests/leave";

// Status Label Mappings
const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  PENDING_MANAGER: "Pending Manager Approval",
  APPROVED_MANAGER: "Approved by Manager",
  REJECTED_MANAGER: "Rejected by Manager",
  PENDING_HR: "Pending HR Approval",
  APPROVED_HR: "Approved by HR",
  REJECTED_HR: "Rejected by HR",
  CANCELLED: "Cancelled",
};

// Status Color Mappings
const LEAVE_STATUS_COLORS: Record<LeaveStatus, string> = {
  PENDING_MANAGER: "yellow",
  APPROVED_MANAGER: "blue",
  REJECTED_MANAGER: "red",
  PENDING_HR: "yellow",
  APPROVED_HR: "green",
  REJECTED_HR: "red",
  CANCELLED: "gray",
};

// Leave Type Label Mappings
const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  CASUAL: "Casual Leave",
  SICK: "Sick Leave",
  PAID: "Paid Leave",
  UNPAID: "Unpaid Leave",
};

// Day Type Label Mappings
const DAY_TYPE_LABELS: Record<DayType, string> = {
  FULL_DAY: "Full Day",
  FIRST_HALF: "First Half",
  SECOND_HALF: "Second Half",
};

// Transformation Functions
export function getLeaveStatusLabel(
  status: LeaveStatus | null | undefined
): string {
  if (!status) return "—";
  return LEAVE_STATUS_LABELS[status] || status;
}

export function getLeaveStatusColor(
  status: LeaveStatus | null | undefined
): string {
  if (!status) return "gray";
  return LEAVE_STATUS_COLORS[status] || "gray";
}

export function getLeaveTypeLabel(
  leaveType: LeaveType | null | undefined
): string {
  if (!leaveType) return "—";
  return LEAVE_TYPE_LABELS[leaveType] || leaveType;
}

export function getDayTypeLabel(
  dayType: DayType | null | undefined
): string {
  if (!dayType) return "—";
  return DAY_TYPE_LABELS[dayType] || dayType;
}

/**
 * Formats number of days to human-readable label
 * Examples: "3 days", "0.5 day", "1 day"
 */
export function formatLeaveDuration(
  numberOfDays: number | null | undefined
): string {
  if (numberOfDays === null || numberOfDays === undefined) return "—";
  
  if (numberOfDays === 0.5) {
    return "0.5 day";
  }
  
  if (numberOfDays === 1) {
    return "1 day";
  }
  
  return `${numberOfDays} days`;
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
 * Example: "2024-02-15" -> "Feb 15, 2024"
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
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
 * Formats ISO 8601 datetime string to user-friendly format
 * Example: "2024-02-10T10:30:00Z" -> "Feb 10, 2024, 10:30 AM"
 */
export function formatDateTime(dateString: string | null | undefined): string {
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
 * Formats ISO 8601 datetime string to relative time
 * Example: "2 hours ago", "3 days ago", or absolute date if older
 */
export function formatRelativeTime(dateString: string | null | undefined): string {
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

/**
 * Formats date range for display
 * Example: "Feb 15 - 17, 2024" or "Feb 15, 2024" if same day
 */
export function formatDateRange(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): string {
  if (!startDate) return "—";
  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // If same month and year, show: "Feb 15 - 17, 2024"
    if (
      start.getMonth() === end.getMonth() &&
      start.getFullYear() === end.getFullYear()
    ) {
      const month = start.toLocaleDateString("en-US", { month: "short" });
      const year = start.getFullYear();
      const startDay = start.getDate();
      const endDay = end.getDate();
      return `${month} ${startDay} - ${endDay}, ${year}`;
    }
    
    // Otherwise show both dates
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch {
    return `${startDate} - ${endDate}`;
  }
}

/**
 * Determines if leave is in terminal state (fully approved, rejected, or cancelled)
 * A leave is terminal when:
 * - HR has approved (APPROVED_HR) - fully approved
 * - Manager or HR has rejected (REJECTED_MANAGER, REJECTED_HR) - rejected
 * - Leave is cancelled (CANCELLED) - cancelled
 * 
 * A leave is NOT terminal when:
 * - APPROVED_MANAGER with PENDING_HR - still pending HR approval
 * - PENDING_MANAGER - still pending manager approval
 */
export function isTerminalState(
  managerStatus: LeaveStatus | null | undefined,
  hrStatus: LeaveStatus | null | undefined
): boolean {
  if (!managerStatus || !hrStatus) return false;
  
  // Fully approved by HR
  if (hrStatus === "APPROVED_HR") return true;
  
  // Rejected by manager or HR
  if (managerStatus === "REJECTED_MANAGER" || hrStatus === "REJECTED_HR") return true;
  
  // Cancelled
  if (managerStatus === "CANCELLED" || hrStatus === "CANCELLED") return true;
  
  // Not terminal - still pending approval
  return false;
}

/**
 * Determines if leave is pending (awaiting approval)
 */
export function isPendingState(
  managerStatus: LeaveStatus | null | undefined,
  hrStatus: LeaveStatus | null | undefined
): boolean {
  if (!managerStatus || !hrStatus) return false;
  
  return (
    managerStatus === "PENDING_MANAGER" ||
    hrStatus === "PENDING_HR"
  );
}

/**
 * Gets the current workflow stage
 */
export function getWorkflowStage(
  managerStatus: LeaveStatus | null | undefined,
  hrStatus: LeaveStatus | null | undefined
): "manager" | "hr" | "completed" | "rejected" | "cancelled" | "unknown" {
  if (!managerStatus || !hrStatus) return "unknown";
  
  if (managerStatus === "CANCELLED" || hrStatus === "CANCELLED") {
    return "cancelled";
  }
  
  if (managerStatus === "REJECTED_MANAGER" || hrStatus === "REJECTED_HR") {
    return "rejected";
  }
  
  if (hrStatus === "APPROVED_HR") {
    return "completed";
  }
  
  if (managerStatus === "PENDING_MANAGER") {
    return "manager";
  }
  
  if (hrStatus === "PENDING_HR") {
    return "hr";
  }
  
  return "unknown";
}

// Transformed Leave Summary
export interface TransformedLeaveSummary {
  id: string;
  employee_id: string;
  employee: {
    id: string;
    first_name: string;
    last_name: string;
    fullName: string;
  };
  leave_type: LeaveType;
  leaveTypeLabel: string;
  start_date: string;
  end_date: string;
  dateRangeFormatted: string;
  startDateFormatted: string;
  endDateFormatted: string;
  day_type: DayType;
  dayTypeLabel: string;
  number_of_days: number;
  durationLabel: string;
  manager_status: LeaveStatus;
  managerStatusLabel: string;
  managerStatusColor: string;
  hr_status: LeaveStatus;
  hrStatusLabel: string;
  hrStatusColor: string;
  created_at: string;
  createdAtFormatted: string;
  updated_at: string;
  updatedAtFormatted: string;
  isTerminal: boolean;
  isPending: boolean;
  workflowStage: "manager" | "hr" | "completed" | "rejected" | "cancelled" | "unknown";
}

// Transformed Leave Detail
export interface TransformedLeaveDetail extends LeaveDetail {
  employeeFullName: string;
  leaveTypeLabel: string;
  dayTypeLabel: string;
  dateRangeFormatted: string;
  startDateFormatted: string;
  endDateFormatted: string;
  durationLabel: string;
  managerStatusLabel: string;
  managerStatusColor: string;
  hrStatusLabel: string;
  hrStatusColor: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  updatedAtRelative: string;
  managerApprovedAtFormatted: string | null;
  hrApprovedAtFormatted: string | null;
  isTerminal: boolean;
  isPending: boolean;
  workflowStage: "manager" | "hr" | "completed" | "rejected" | "cancelled" | "unknown";
}

/**
 * Transform a single leave summary for display
 */
export function transformLeaveSummary(
  leave: LeaveSummary
): TransformedLeaveSummary {
  return {
    ...leave,
    employee: {
      ...leave.employee,
      fullName: formatEmployeeName(
        leave.employee.first_name,
        leave.employee.last_name
      ),
    },
    leaveTypeLabel: getLeaveTypeLabel(leave.leave_type),
    dateRangeFormatted: formatDateRange(leave.start_date, leave.end_date),
    startDateFormatted: formatDate(leave.start_date),
    endDateFormatted: formatDate(leave.end_date),
    dayTypeLabel: getDayTypeLabel(leave.day_type),
    durationLabel: formatLeaveDuration(leave.number_of_days),
    managerStatusLabel: getLeaveStatusLabel(leave.manager_status),
    managerStatusColor: getLeaveStatusColor(leave.manager_status),
    hrStatusLabel: getLeaveStatusLabel(leave.hr_status),
    hrStatusColor: getLeaveStatusColor(leave.hr_status),
    createdAtFormatted: formatDateTime(leave.created_at),
    updatedAtFormatted: formatDateTime(leave.updated_at),
    isTerminal: isTerminalState(leave.manager_status, leave.hr_status),
    isPending: isPendingState(leave.manager_status, leave.hr_status),
    workflowStage: getWorkflowStage(leave.manager_status, leave.hr_status),
  };
}

/**
 * Transform a single leave detail for display
 */
export function transformLeaveDetail(
  leave: LeaveDetail
): TransformedLeaveDetail {
  return {
    ...leave,
    employeeFullName: formatEmployeeName(
      leave.employee.first_name,
      leave.employee.last_name
    ),
    leaveTypeLabel: getLeaveTypeLabel(leave.leave_type),
    dayTypeLabel: getDayTypeLabel(leave.day_type),
    dateRangeFormatted: formatDateRange(leave.start_date, leave.end_date),
    startDateFormatted: formatDate(leave.start_date),
    endDateFormatted: formatDate(leave.end_date),
    durationLabel: formatLeaveDuration(leave.number_of_days),
    managerStatusLabel: getLeaveStatusLabel(leave.manager_status),
    managerStatusColor: getLeaveStatusColor(leave.manager_status),
    hrStatusLabel: getLeaveStatusLabel(leave.hr_status),
    hrStatusColor: getLeaveStatusColor(leave.hr_status),
    createdAtFormatted: formatDateTime(leave.created_at),
    updatedAtFormatted: formatDateTime(leave.updated_at),
    updatedAtRelative: formatRelativeTime(leave.updated_at),
    managerApprovedAtFormatted: leave.manager_approved_at
      ? formatDateTime(leave.manager_approved_at)
      : null,
    hrApprovedAtFormatted: leave.hr_approved_at
      ? formatDateTime(leave.hr_approved_at)
      : null,
    isTerminal: isTerminalState(leave.manager_status, leave.hr_status),
    isPending: isPendingState(leave.manager_status, leave.hr_status),
    workflowStage: getWorkflowStage(leave.manager_status, leave.hr_status),
  };
}

/**
 * Hook for transforming leave summaries
 * @param leaves - Array of leave summaries
 * @returns Transformed leave summaries
 */
export function useLeaveTransformations(
  leaves: LeaveSummary[]
): TransformedLeaveSummary[] {
  return useMemo(() => {
    return leaves.map(transformLeaveSummary);
  }, [leaves]);
}


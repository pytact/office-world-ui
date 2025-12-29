// Audit Log Transformations Hook
// Encapsulates data transformations for audit log display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  AuditLogSummary,
  AuditLogDetail,
} from "@/utils/types/responses/auditLog";

// Action Code Label Mappings
// Maps action codes to human-readable labels
const ACTION_CODE_LABELS: Record<string, string> = {
  USER_INVITED: "User Invited",
  ROLE_ASSIGNED: "Role Assigned",
  TASK_CREATED: "Task Created",
  TASK_UPDATED: "Task Updated",
  TASK_DELETED: "Task Deleted",
  LEAVE_APPROVED: "Leave Approved",
  LEAVE_REJECTED: "Leave Rejected",
  SALARY_UPDATED: "Salary Updated",
  ATTENDANCE_CHECK_IN: "Attendance Check In",
  ATTENDANCE_CHECK_OUT: "Attendance Check Out",
  SYSTEM_AUTO_CHECK_OUT: "System Auto Check Out",
};

// Table Name Label Mappings
// Maps table names to human-readable entity names
const TABLE_NAME_LABELS: Record<string, string> = {
  users: "Users",
  employees: "Employees",
  tasks: "Tasks",
  projects: "Projects",
  task_assignments: "Task Assignments",
  leaves: "Leaves",
  attendance: "Attendance",
  salaries: "Salaries",
  companies: "Companies",
  notifications: "Notifications",
  permissions: "Permissions",
};

// Role Code Label Mappings
// Maps role codes to human-readable role names
const ROLE_CODE_LABELS: Record<string, string> = {
  ceo: "CEO",
  hr: "HR",
  manager: "Manager",
  employee: "Employee",
  superadmin: "Super Admin",
};

/**
 * Formats action code to human-readable label
 * Example: "TASK_UPDATED" -> "Task Updated"
 */
export function formatActionCode(
  actionCode: string | null | undefined
): string {
  if (!actionCode) return "—";
  return ACTION_CODE_LABELS[actionCode] || actionCode.replace(/_/g, " ");
}

/**
 * Formats table name to human-readable entity name
 * Example: "tasks" -> "Tasks"
 */
export function formatTableName(
  tableName: string | null | undefined
): string {
  if (!tableName) return "—";
  return TABLE_NAME_LABELS[tableName] || tableName;
}

/**
 * Formats role code to human-readable role name
 * Example: "hr" -> "HR"
 */
export function formatRoleCode(
  roleCode: string | null | undefined
): string {
  if (!roleCode) return "—";
  return ROLE_CODE_LABELS[roleCode] || roleCode.toUpperCase();
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

    // For older dates, return formatted date
    return formatAbsoluteDateTime(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Formats ISO 8601 datetime string to absolute date and time
 * Example: "2024-01-20T10:30:00Z" -> "Jan 20, 2024, 10:30 AM"
 * Note: Converts UTC to local timezone for display
 */
export function formatAbsoluteDateTime(
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
 * Formats ISO 8601 datetime string to date only
 * Example: "2024-01-20T10:30:00Z" -> "Jan 20, 2024"
 */
export function formatDate(
  dateString: string | null | undefined
): string {
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
 * Formats ISO 8601 datetime string to time only
 * Example: "2024-01-20T10:30:00Z" -> "10:30 AM"
 */
export function formatTime(
  dateString: string | null | undefined
): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats record ID (UUID) for display
 * Example: "550e8400-e29b-41d4-a716-446655440000" -> "550e8400...440000"
 */
export function formatRecordId(
  recordId: string | null | undefined
): string {
  if (!recordId) return "—";
  if (recordId.length <= 20) return recordId;
  return `${recordId.substring(0, 8)}...${recordId.substring(recordId.length - 6)}`;
}

/**
 * Formats actor display name
 * Already provided by API, but can be used for consistency
 * Example: "Jane Doe (HR)" or "SYSTEM"
 */
export function formatActorDisplayName(
  actorDisplayName: string | null | undefined
): string {
  if (!actorDisplayName) return "SYSTEM";
  return actorDisplayName;
}

/**
 * Formats value changes for display
 * Converts JSON object to formatted key-value pairs
 */
export function formatValueChanges(
  values: Record<string, unknown> | null | undefined
): Record<string, string> {
  if (!values) return {};
  
  const formatted: Record<string, string> = {};
  for (const [key, value] of Object.entries(values)) {
    // Format field name (snake_case to Title Case)
    const formattedKey = key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
    
    // Format value
    if (value === null || value === undefined) {
      formatted[formattedKey] = "null";
    } else if (typeof value === "object") {
      formatted[formattedKey] = JSON.stringify(value);
    } else {
      formatted[formattedKey] = String(value);
    }
  }
  
  return formatted;
}

// Transformed Audit Log Summary
export interface TransformedAuditLogSummary {
  id: string;
  action_code: string;
  actionCodeLabel: string;
  table_name: string;
  tableNameLabel: string;
  record_id: string | null;
  recordIdFormatted: string;
  description: string | null;
  created_at: string;
  createdAtRelative: string;
  createdAtAbsolute: string;
  createdAtDate: string;
  createdAtTime: string;
  actor: {
    id: string;
    first_name: string;
    last_name: string;
    role_code: string;
  } | null;
  actor_display_name: string;
  actorDisplayNameFormatted: string;
}

// Transformed Audit Log Detail
export interface TransformedAuditLogDetail extends AuditLogDetail {
  actionCodeLabel: string;
  tableNameLabel: string;
  recordIdFormatted: string;
  createdAtRelative: string;
  createdAtAbsolute: string;
  createdAtDate: string;
  createdAtTime: string;
  actorDisplayNameFormatted: string;
  oldValuesFormatted: Record<string, string>;
  newValuesFormatted: Record<string, string>;
}

/**
 * Transform a single audit log summary for display
 */
export function transformAuditLogSummary(
  auditLog: AuditLogSummary
): TransformedAuditLogSummary {
  return {
    ...auditLog,
    actionCodeLabel: formatActionCode(auditLog.action_code),
    tableNameLabel: formatTableName(auditLog.table_name),
    recordIdFormatted: formatRecordId(auditLog.record_id),
    createdAtRelative: formatRelativeTime(auditLog.created_at),
    createdAtAbsolute: formatAbsoluteDateTime(auditLog.created_at),
    createdAtDate: formatDate(auditLog.created_at),
    createdAtTime: formatTime(auditLog.created_at),
    actorDisplayNameFormatted: formatActorDisplayName(auditLog.actor_display_name),
  };
}

/**
 * Transform a single audit log detail for display
 */
export function transformAuditLogDetail(
  auditLog: AuditLogDetail
): TransformedAuditLogDetail {
  return {
    ...auditLog,
    actionCodeLabel: formatActionCode(auditLog.action_code),
    tableNameLabel: formatTableName(auditLog.table_name),
    recordIdFormatted: formatRecordId(auditLog.record_id),
    createdAtRelative: formatRelativeTime(auditLog.created_at),
    createdAtAbsolute: formatAbsoluteDateTime(auditLog.created_at),
    createdAtDate: formatDate(auditLog.created_at),
    createdAtTime: formatTime(auditLog.created_at),
    actorDisplayNameFormatted: formatActorDisplayName(auditLog.actor_display_name),
    oldValuesFormatted: formatValueChanges(auditLog.old_values),
    newValuesFormatted: formatValueChanges(auditLog.new_values),
  };
}

/**
 * Hook for transforming audit log summaries
 * @param summaries - Array of audit log summaries
 * @returns Transformed audit log summaries
 */
export function useAuditLogTransformations(
  summaries: AuditLogSummary[]
): TransformedAuditLogSummary[] {
  return useMemo(() => {
    return summaries.map((summary) => transformAuditLogSummary(summary));
  }, [summaries]);
}

/**
 * Hook for transforming a single audit log detail
 * @param detail - Audit log detail
 * @returns Transformed audit log detail
 */
export function useAuditLogDetailTransformation(
  detail: AuditLogDetail | null | undefined
): TransformedAuditLogDetail | null {
  return useMemo(() => {
    if (!detail) return null;
    return transformAuditLogDetail(detail);
  }, [detail]);
}


// Task Transformations Hook
// Encapsulates data transformations for task display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  TaskSummary,
  TaskDetail,
} from "@/utils/types/responses/task";
import { TaskStatus } from "@/utils/types/requests/task";

// ENUM to Label Mappings
const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  HALT: "Halted",
  REVIEW: "In Review",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

// Status Color Mappings
const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
  TODO: "gray",
  IN_PROGRESS: "blue",
  HALT: "yellow",
  REVIEW: "purple",
  DONE: "green",
  CANCELLED: "red",
};

// Permission Label Mappings
const PERMISSION_LABELS: Record<"OWNER" | "EDITOR" | "VIEWER", string> = {
  OWNER: "Owner",
  EDITOR: "Editor",
  VIEWER: "Viewer",
};

// Transformation Functions
export function getTaskStatusLabel(
  status: TaskStatus | null | undefined
): string {
  if (!status) return "—";
  return TASK_STATUS_LABELS[status] || status;
}

export function getTaskStatusColor(
  status: TaskStatus | null | undefined
): string {
  if (!status) return "gray";
  return TASK_STATUS_COLORS[status] || "gray";
}

export function getPermissionLabel(
  permission: "OWNER" | "EDITOR" | "VIEWER" | null | undefined
): string {
  if (!permission) return "—";
  return PERMISSION_LABELS[permission] || permission;
}

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

export function isTerminalState(status: TaskStatus | null | undefined): boolean {
  return status === "DONE" || status === "CANCELLED";
}

export function getProjectDisplayName(
  project: { name: string } | null | undefined
): string {
  if (!project) return "No Project";
  return project.name;
}

// Transformed Task Summary
export interface TransformedTaskSummary {
  task_id: string;
  name: string;
  status: TaskStatus;
  statusLabel: string;
  statusColor: string;
  project_id: string | null;
  projectDisplayName: string;
  owner_id: string;
  is_owner: boolean;
  user_permission: "OWNER" | "EDITOR" | "VIEWER";
  permissionLabel: string;
  can_edit_task: boolean;
  can_change_status: boolean;
  created_at: string;
  createdAtFormatted: string;
  updated_at: string;
  updatedAtFormatted: string;
  isTerminal: boolean;
}

// Transformed Task Detail
export interface TransformedTaskDetail extends TaskDetail {
  statusLabel: string;
  statusColor: string;
  permissionLabel: string;
  projectDisplayName: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  updatedAtRelative: string;
  isTerminal: boolean;
}

/**
 * Transform a single task summary for display
 */
export function transformTaskSummary(
  task: TaskSummary
): TransformedTaskSummary {
  return {
    ...task,
    statusLabel: getTaskStatusLabel(task.status),
    statusColor: getTaskStatusColor(task.status),
    projectDisplayName: getProjectDisplayName(task.project || null),
    permissionLabel: getPermissionLabel(task.user_permission),
    createdAtFormatted: formatDateTime(task.created_at),
    updatedAtFormatted: formatDateTime(task.updated_at),
    isTerminal: isTerminalState(task.status),
  };
}

/**
 * Transform a single task detail for display
 */
export function transformTaskDetail(
  task: TaskDetail
): TransformedTaskDetail {
  return {
    ...task,
    statusLabel: getTaskStatusLabel(task.status),
    statusColor: getTaskStatusColor(task.status),
    permissionLabel: getPermissionLabel(task.user_permission || null),
    projectDisplayName: getProjectDisplayName(task.project || null),
    createdAtFormatted: formatDateTime(task.created_at),
    updatedAtFormatted: formatDateTime(task.updated_at),
    updatedAtRelative: formatRelativeTime(task.updated_at),
    isTerminal: isTerminalState(task.status),
  };
}

/**
 * Hook for transforming task summaries
 * @param tasks - Array of task summaries
 * @returns Transformed task summaries
 */
export function useTaskTransformations(
  tasks: TaskSummary[]
): TransformedTaskSummary[] {
  return useMemo(() => {
    return tasks.map(transformTaskSummary);
  }, [tasks]);
}


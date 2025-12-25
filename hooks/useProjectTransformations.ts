// Project Transformations Hook
// Encapsulates data transformations for project display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  ProjectSummary,
  ProjectDetail,
  TaskSummary,
} from "@/utils/types/responses/project";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

// ENUM to Label Mappings
const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  COMPLETED: "Completed",
};

// Status Color Mappings
const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  ACTIVE: "green",
  INACTIVE: "yellow",
  COMPLETED: "gray",
};

// Transformation Functions
export function getProjectStatusLabel(
  status: ProjectStatus | null | undefined
): string {
  if (!status) return "—";
  return PROJECT_STATUS_LABELS[status] || status;
}

export function getProjectStatusColor(
  status: ProjectStatus | null | undefined
): string {
  if (!status) return "gray";
  return PROJECT_STATUS_COLORS[status] || "gray";
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

export function getTaskCountLabel(taskCount: number): string {
  if (taskCount === 0) return "No tasks";
  if (taskCount === 1) return "1 task";
  return `${taskCount} tasks`;
}

export function isProjectFrozen(status: ProjectStatus | null | undefined): boolean {
  return status === "INACTIVE" || status === "COMPLETED";
}

// Transformed Project Summary
export interface TransformedProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  statusColor: string;
  task_count: number;
  taskCountLabel: string;
  is_frozen: boolean;
  created_at: string;
  createdAtFormatted: string;
  updated_at: string;
  updatedAtFormatted: string;
}

// Transformed Project Detail
export interface TransformedProjectDetail extends ProjectDetail {
  statusLabel: string;
  statusColor: string;
  taskCountLabel: string;
  is_frozen: boolean; // Derived from status
  createdAtFormatted: string;
  updatedAtFormatted: string;
  tasks: TaskSummary[]; // Already in response, but included for completeness
}

/**
 * Transform a single project summary for display
 */
export function transformProjectSummary(
  project: ProjectSummary
): TransformedProjectSummary {
  return {
    ...project,
    statusLabel: getProjectStatusLabel(project.status),
    statusColor: getProjectStatusColor(project.status),
    taskCountLabel: getTaskCountLabel(project.task_count),
    is_frozen: isProjectFrozen(project.status),
    createdAtFormatted: formatDateTime(project.created_at),
    updatedAtFormatted: formatDateTime(project.updated_at),
  };
}

/**
 * Transform a single project detail for display
 */
export function transformProjectDetail(
  project: ProjectDetail
): TransformedProjectDetail {
  // Use is_frozen from API if available, otherwise derive from status
  const frozen = project.is_frozen ?? isProjectFrozen(project.status);

  return {
    ...project,
    statusLabel: getProjectStatusLabel(project.status),
    statusColor: getProjectStatusColor(project.status),
    taskCountLabel: getTaskCountLabel(project.task_count),
    is_frozen: frozen,
    createdAtFormatted: formatDateTime(project.created_at),
    updatedAtFormatted: formatDateTime(project.updated_at),
    tasks: project.tasks || [],
  };
}

/**
 * Hook for transforming project summaries
 * @param projects - Array of project summaries
 * @returns Transformed project summaries
 */
export function useProjectTransformations(
  projects: ProjectSummary[]
): TransformedProjectSummary[] {
  return useMemo(() => {
    return projects.map(transformProjectSummary);
  }, [projects]);
}


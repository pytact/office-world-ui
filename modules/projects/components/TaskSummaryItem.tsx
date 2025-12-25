// Task Summary Item Component
// Feature-specific component - R16 Layer 2
// Displays task information in project detail view

"use client";

import React, { useMemo } from "react";
import { colors, typography, spacing } from "@/theme/tokens";
import type { TaskSummary } from "@/utils/types/responses/project";

interface TaskSummaryItemProps {
  task: TaskSummary;
  className?: string;
}

/**
 * Task Summary Item Component
 * Displays a single task in the project task list
 * Following R17: Clear task information display
 */
export const TaskSummaryItem = React.memo(function TaskSummaryItem({
  task,
  className = "",
}: TaskSummaryItemProps) {
  const containerStyle = useMemo(
    () => ({
      padding: spacing[4],
      borderBottom: `1px solid ${colors.borderLight}`,
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const metaStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  return (
    <div className={className} style={containerStyle}>
      <div style={titleStyle}>{task.title}</div>
      <div style={metaStyle}>
        Status: {task.status} • Assignee ID: {task.assignee_id}
      </div>
    </div>
  );
});


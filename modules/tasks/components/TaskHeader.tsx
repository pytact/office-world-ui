// Task Detail Header Component
// Screen UI component - R16 Layer 3
// Header section for task detail view
// Following R17: Primary attention anchor

"use client";

import React, { useMemo } from "react";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedTaskDetail } from "@/hooks/useTaskTransformations";

interface TaskHeaderProps {
  task: TransformedTaskDetail;
}

/**
 * Task Detail Header Component
 * Header section showing task name and status
 * Following R17: Primary attention anchor
 * Following R14: Memoized for performance
 */
export const TaskHeader = React.memo(function TaskHeader({
  task,
}: TaskHeaderProps) {
  const containerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const titleRowStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center" as const,
      gap: spacing[4],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
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
    <div style={containerStyle}>
      <div style={titleRowStyle}>
        <h1 style={titleStyle}>{task.name}</h1>
        <TaskStatusBadge status={task.status} />
      </div>
      <div style={metaStyle}>
        {task.projectDisplayName} • Created {task.createdAtFormatted} • Updated {task.updatedAtRelative}
      </div>
    </div>
  );
});


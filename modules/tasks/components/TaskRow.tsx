// Task Row Component
// Feature-specific component - R16 Layer 2
// Composes TableRow + Badge for task list display
// Following R17: Clickable row with clear visual hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { colors, typography, spacing } from "@/theme/tokens";
import type { TransformedTaskSummary } from "@/hooks/useTaskTransformations";

interface TaskRowProps {
  task: TransformedTaskSummary;
  onClick: (taskId: string) => void;
}

/**
 * Task Row Component
 * Displays a single task in the list table
 * Following R17: Clickable row with clear visual hierarchy
 */
export const TaskRow = React.memo(function TaskRow({
  task,
  onClick,
}: TaskRowProps) {
  const handleClick = useCallback(() => {
    onClick(task.task_id);
  }, [task.task_id, onClick]);

  // Memoized styles for performance (R15)
  const nameCellStyle = useMemo(
    () => ({
      color: colors.primary,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      cursor: "pointer",
    } as const),
    []
  );

  const textStyle = useMemo(
    () => ({
      color: colors.textMuted,
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  return (
    <TableRow onClick={handleClick} hover>
      <TableCell>
        <span style={nameCellStyle}>{task.name}</span>
      </TableCell>
      <TableCell>
        <TaskStatusBadge status={task.status} />
      </TableCell>
      <TableCell>
        <span style={textStyle}>{task.projectDisplayName}</span>
      </TableCell>
      <TableCell>
        <span style={textStyle}>{task.permissionLabel}</span>
      </TableCell>
      <TableCell>
        <span style={textStyle}>{task.updatedAtFormatted}</span>
      </TableCell>
    </TableRow>
  );
});


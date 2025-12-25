// Task Status Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with task-specific status mapping
// Following R17: Clear visual status indication

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { TaskStatus } from "@/utils/types/requests/task";
import { getTaskStatusLabel, getTaskStatusColor } from "@/hooks/useTaskTransformations";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

/**
 * Task Status Badge
 * Maps task status to appropriate badge variant and label
 * Following R17: Clear visual status indication
 * Following R14: Memoized for performance
 */
export const TaskStatusBadge = React.memo(function TaskStatusBadge({
  status,
  className = "",
}: TaskStatusBadgeProps) {
  const statusConfig = useMemo(
    () => ({
      TODO: {
        variant: "default" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
      IN_PROGRESS: {
        variant: "info" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
      HALT: {
        variant: "warning" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
      REVIEW: {
        variant: "info" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
      DONE: {
        variant: "success" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
      CANCELLED: {
        variant: "error" as const,
        label: getTaskStatusLabel(status),
        color: getTaskStatusColor(status),
      },
    }),
    [status]
  );

  const config = useMemo(() => statusConfig[status], [statusConfig, status]);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
});


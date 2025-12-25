// Task Status Control Component
// Feature-specific component - R16 Layer 2
// Status change control for task detail (owner only)

"use client";

import React, { useMemo, useCallback } from "react";
import { TaskStatusSelector } from "./TaskStatusSelector";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import { TaskStatus } from "@/utils/types/requests/task";

interface TaskStatusControlProps {
  currentStatus: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
  disabled?: boolean;
  isLoading?: boolean;
  showButton?: boolean; // If true, shows a button instead of direct selector
}

/**
 * Task Status Control Component
 * Status change control for task detail
 * Following R17: Primary action for owners
 */
export const TaskStatusControl = React.memo(function TaskStatusControl({
  currentStatus,
  onStatusChange,
  disabled = false,
  isLoading = false,
  showButton = false,
}: TaskStatusControlProps) {
  const handleStatusChange = useCallback(
    (status: TaskStatus) => {
      // If status changed, trigger the change handler
      if (status !== currentStatus) {
        onStatusChange(status);
      }
    },
    [currentStatus, onStatusChange]
  );

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const controlGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[3],
      alignItems: "flex-end" as const,
    } as const),
    []
  );

  const selectorWrapperStyle = useMemo(
    () => ({
      flex: 1,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>Status</label>
      <div style={controlGroupStyle}>
        <div style={selectorWrapperStyle}>
          <TaskStatusSelector
            value={currentStatus}
            onChange={handleStatusChange}
            disabled={disabled || isLoading}
          />
        </div>
      </div>
    </div>
  );
});


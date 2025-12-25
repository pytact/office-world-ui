// Task Status Selector Component
// Feature-specific component - R16 Layer 2
// Status selection dropdown for task detail

"use client";

import React, { useMemo, useCallback } from "react";
import { Select } from "@/components/ui";
import { TaskStatus } from "@/utils/types/requests/task";
import { getTaskStatusLabel } from "@/hooks/useTaskTransformations";

interface TaskStatusSelectorProps {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_OPTIONS: TaskStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "HALT",
  "REVIEW",
  "DONE",
  "CANCELLED",
];

/**
 * Task Status Selector Component
 * Dropdown for selecting task status
 * Following R17: Clear status selection
 */
export const TaskStatusSelector = React.memo(function TaskStatusSelector({
  value,
  onChange,
  disabled = false,
  className = "",
}: TaskStatusSelectorProps) {
  const options = useMemo(
    () =>
      STATUS_OPTIONS.map((status) => ({
        value: status,
        label: getTaskStatusLabel(status),
      })),
    []
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as TaskStatus);
    },
    [onChange]
  );

  return (
    <Select
      value={value}
      onChange={handleChange}
      options={options}
      disabled={disabled}
      className={className}
    />
  );
});


// Project Status Selector Component
// Feature-specific component - R16 Layer 2
// Composes Select with project status options

"use client";

import React, { useCallback } from "react";
import { Select } from "@/components/ui/Select";
import type { ProjectUpdate } from "@/utils/types/requests/project";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface ProjectStatusSelectorProps {
  value: ProjectStatus | null;
  onChange: (value: ProjectStatus) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

const STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "COMPLETED", label: "Completed" },
] as const;

/**
 * Project Status Selector Component
 * Dropdown for selecting project status
 * Following R17: Clear status selection
 * Following R14: Memoized for performance
 */
export const ProjectStatusSelector = React.memo(function ProjectStatusSelector({
  value,
  onChange,
  error = false,
  errorMessage,
  disabled = false,
}: ProjectStatusSelectorProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as ProjectStatus);
    },
    [onChange]
  );

  return (
    <Select
      value={value || ""}
      onChange={handleChange}
      options={STATUS_OPTIONS}
      error={error}
      errorMessage={errorMessage}
      disabled={disabled}
    />
  );
});


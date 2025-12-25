// Project Status Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with project-specific status mapping

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import type { ProjectSummary, ProjectDetail } from "@/utils/types/responses/project";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

/**
 * Project Status Badge
 * Maps project status to appropriate badge variant
 * Following R17: Clear visual status indication
 * Following R14: Memoized for performance
 */
export const ProjectStatusBadge = React.memo(function ProjectStatusBadge({
  status,
  className = "",
}: ProjectStatusBadgeProps) {
  const statusConfig = useMemo(
    () => ({
      ACTIVE: {
        variant: "success" as const,
        label: "Active",
      },
      INACTIVE: {
        variant: "warning" as const,
        label: "Inactive",
      },
      COMPLETED: {
        variant: "info" as const,
        label: "Completed",
      },
    }),
    []
  );

  const config = useMemo(() => statusConfig[status], [statusConfig, status]);

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
});


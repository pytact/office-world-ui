// Project Row Component
// Feature-specific component - R16 Layer 2
// Composes TableRow + Badge for project list display

"use client";

import React, { useCallback, useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { colors, typography, spacing } from "@/theme/tokens";
import type { TransformedProjectSummary } from "@/hooks/useProjectTransformations";

interface ProjectRowProps {
  project: TransformedProjectSummary;
  onClick: (projectId: string) => void;
}

/**
 * Project Row Component
 * Displays a single project in the list table
 * Following R17: Clickable row with clear visual hierarchy
 */
export const ProjectRow = React.memo(function ProjectRow({
  project,
  onClick,
}: ProjectRowProps) {
  const handleClick = useCallback(() => {
    onClick(project.id);
  }, [project.id, onClick]);

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

  const taskCountStyle = useMemo(
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
        <span style={nameCellStyle}>{project.name}</span>
      </TableCell>
      <TableCell>
        <ProjectStatusBadge status={project.status} />
      </TableCell>
      <TableCell>
        <span style={taskCountStyle}>{project.taskCountLabel}</span>
      </TableCell>
      <TableCell>
        <span style={taskCountStyle}>{project.createdAtFormatted}</span>
      </TableCell>
    </TableRow>
  );
});


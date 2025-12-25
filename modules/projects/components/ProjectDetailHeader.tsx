// Project Detail Header Component
// Screen UI component - R16 Layer 3
// Header section for project detail view

"use client";

import React, { useMemo } from "react";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedProjectDetail } from "@/hooks/useProjectTransformations";

interface ProjectDetailHeaderProps {
  project: TransformedProjectDetail;
}

/**
 * Project Detail Header Component
 * Header section showing project name and status
 * Following R17: Primary attention anchor
 * Following R14: Memoized for performance
 */
export const ProjectDetailHeader = React.memo(function ProjectDetailHeader({
  project,
}: ProjectDetailHeaderProps) {
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
        <h1 style={titleStyle}>{project.name}</h1>
        <ProjectStatusBadge status={project.status} />
      </div>
      <div style={metaStyle}>
        {project.taskCountLabel} • Created {project.createdAtFormatted}
      </div>
    </div>
  );
});


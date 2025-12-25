// Project Status Display Component
// Screen UI component - R16 Layer 3
// Read-only status display for project detail view

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { ProjectStatusBadge } from "./ProjectStatusBadge";
import { spacing, typography, colors } from "@/theme/tokens";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface ProjectStatusControlProps {
  currentStatus: ProjectStatus;
}

/**
 * Project Status Display Component
 * Read-only status display (editing moved to edit form)
 * Following R17: Secondary information display
 * Following R14: Memoized for performance
 */
export const ProjectStatusControl = React.memo(function ProjectStatusControl({
  currentStatus,
}: ProjectStatusControlProps) {
  const containerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      margin: 0,
    } as const),
    []
  );

  const statusDisplayStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center" as const,
      gap: spacing[3],
    } as const),
    []
  );

  return (
    <Card variant="outlined" padding="md" style={containerStyle}>
      <h2 style={titleStyle}>Status</h2>
      <div style={statusDisplayStyle}>
        <ProjectStatusBadge status={currentStatus} />
      </div>
    </Card>
  );
});


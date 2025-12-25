// Project Detail Component
// Screen UI component - R16 Layer 3
// Pure UI component for project detail screen

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { ProjectDetailHeader } from "./ProjectDetailHeader";
import { ProjectTaskList } from "./ProjectTaskList";
import { ProjectStatusControl } from "./ProjectStatusControl";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedProjectDetail } from "@/hooks/useProjectTransformations";
import type { ProjectUpdate } from "@/utils/types/requests/project";
import { projectRoutes } from "@/utils/routes/project.routes";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface ProjectDetailProps {
  project: TransformedProjectDetail;
  canUpdate: boolean;
  canDelete: boolean;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

/**
 * Project Detail Component
 * Main UI for project detail screen
 * Following R17: Primary (header), Secondary (tasks, status), Tertiary (delete)
 * Following R14: Memoized for performance
 */
export const ProjectDetail = React.memo(function ProjectDetail({
  project,
  canUpdate,
  canDelete,
  onEdit,
  onDelete,
  isDeleting,
}: ProjectDetailProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push(projectRoutes.company.list);
  }, [router]);

  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backButtonContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const actionsContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[8],
      paddingTop: spacing[6],
      borderTop: `2px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={backButtonContainerStyle}>
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back to Projects
        </Button>
      </div>

      {/* Project Header - Primary */}
      <ProjectDetailHeader project={project} />

      {/* Status Display - Secondary */}
      <ProjectStatusControl currentStatus={project.status} />

      {/* Task List - Secondary */}
      <ProjectTaskList tasks={project.tasks} projectName={project.name} />

      {/* Lifecycle Actions - Below main content */}
      {(canUpdate || canDelete) && (
        <div style={actionsContainerStyle}>
          {canUpdate && (
            <Button type="button" onClick={onEdit} variant="primary">
              Edit Project
            </Button>
          )}
          {canDelete && (
            <Button
              type="button"
              onClick={onDelete}
              isLoading={isDeleting}
              variant="secondary"
              style={{
                backgroundColor: colors.errorText,
                color: colors.textInverse,
              }}
            >
              Delete Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
});


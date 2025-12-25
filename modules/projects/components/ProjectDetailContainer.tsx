// Project Detail Container
// SCR_PROJECT_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectDetail } from "./ProjectDetail";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useGetProject, useDeleteProject } from "@/hooks/useProjects";
import { useProjectContext } from "@/context/ProjectContext";
import { transformProjectDetail } from "@/hooks/useProjectTransformations";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { projectRoutes } from "@/utils/routes/project.routes";

export function ProjectDetailContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const { canViewAllProjects, canUpdateProject, canDeleteProject } = useProjectContext();
  const projectQuery = useGetProject(projectId);
  const deleteMutation = useDeleteProject();

  // Transform project data (derived value - computed after hooks)
  const transformedProject = useMemo(() => {
    if (!projectQuery.data?.data) return null;
    return transformProjectDetail(projectQuery.data.data);
  }, [projectQuery.data?.data]);

  // Permission check (AFTER all hooks)
  if (!canViewAllProjects) {
    return (
      <AccessDenied message="You do not have permission to view this project." />
    );
  }

  // Loading state (AFTER all hooks)
  if (projectQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (projectQuery.isError) {
    return (
      <ErrorState
        message={projectQuery.error?.message || "Failed to load project"}
        onRetry={projectQuery.refetch}
      />
    );
  }

  // No data (AFTER all hooks)
  if (!projectQuery.data?.data || !transformedProject) {
    return (
      <ErrorState
        message="Project not found"
        onRetry={() => router.push(projectRoutes.company.list)}
      />
    );
  }


  const handleDelete = async () => {
    if (!projectId) return;

    if (
      !confirm(
        "Are you sure you want to delete this project? This will also delete all associated tasks. This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Extract ETag from updated_at field (REQUIRED for DELETE)
      const etag = extractETagFromUpdatedAt(projectQuery.data?.data);
      if (!etag) {
        throw new Error("ETag is required for deleting project. Please refresh the page and try again.");
      }

      await deleteMutation.mutateAsync({
        project_id: projectId,
        etag,
      });

      // Navigate to list on success
      router.push(projectRoutes.company.list);
    } catch (error) {
      // Error handling is done by mutation
    }
  };

  const handleEdit = () => {
    router.push(projectRoutes.company.edit(projectId));
  };

  return (
    <>
      <ProjectDetail
        project={transformedProject!}
        canUpdate={canUpdateProject}
        canDelete={canDeleteProject}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
      />

    </>
  );
}


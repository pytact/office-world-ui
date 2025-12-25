// Project Edit Container
// SCR_PROJECT_EDIT - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProjectEditForm } from "./ProjectEditForm";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { useGetProject, useUpdateProject } from "@/hooks/useProjects";
import { useProjectContext } from "@/context/ProjectContext";
import { useProjectUpdateForm } from "@/modules/projects/forms/useProjectUpdateForm";
import { useProjectUpdateFormSubmit } from "@/modules/projects/forms/useProjectUpdateFormSubmit";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { projectRoutes } from "@/utils/routes/project.routes";
import { spacing } from "@/theme/tokens";

export function ProjectEditContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id as string;

  const { canUpdateProject } = useProjectContext();
  const projectQuery = useGetProject(projectId);
  const updateMutation = useUpdateProject();

  // Extract ETag from updated_at field (REQUIRED for PATCH)
  const etag = useMemo(() => {
    return extractETagFromUpdatedAt(projectQuery.data?.data) || undefined;
  }, [projectQuery.data?.data]);

  // Initialize form with project data
  const form = useProjectUpdateForm({
    defaultValues: useMemo(
      () => ({
        name: projectQuery.data?.data?.name || null,
        status: projectQuery.data?.data?.status || null,
      }),
      [projectQuery.data?.data?.name, projectQuery.data?.data?.status]
    ),
  });

  // Populate form when project data loads
  useEffect(() => {
    if (projectQuery.data?.data) {
      form.reset({
        name: projectQuery.data.data.name || null,
        status: projectQuery.data.data.status || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectQuery.data?.data?.id]); // Only reset when project ID changes

  const { submit, isLoading: isSubmitting } = useProjectUpdateFormSubmit({
    form,
    projectId,
    etag,
  });

  // Permission check (AFTER all hooks)
  if (!canUpdateProject) {
    return (
      <AccessDenied message="You do not have permission to edit projects." />
    );
  }

  // Loading state (AFTER all hooks)
  if (projectQuery.isLoading) {
    return <Loader message="Loading project details..." />;
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
  if (!projectQuery.data?.data) {
    return (
      <ErrorState
        message="Project not found"
        onRetry={() => router.push(projectRoutes.company.list)}
      />
    );
  }

  const handleCancel = () => {
    router.push(projectRoutes.company.detail(projectId));
  };

  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    try {
      await submit(values);
      // Navigation handled by submit hook
    } catch (error) {
      // Error handling is done by form
    }
  };

  return (
    <div style={{ padding: `${spacing[8]} ${spacing[6]}`, maxWidth: "800px", margin: "0 auto" }}>
      <ProjectEditForm
        form={form}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        onCancel={handleCancel}
        projectId={projectId}
      />
    </div>
  );
}


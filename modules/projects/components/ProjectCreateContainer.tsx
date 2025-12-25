// Project Create Container
// SCR_PROJECT_CREATE - Container component following R7
// Handles business logic, hooks, and state management
// Following R10: Form logic in hooks, container orchestrates

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectCreateForm } from "./ProjectCreateForm";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useProjectContext } from "@/context/ProjectContext";
import { useProjectForm } from "@/modules/projects/forms/useProjectForm";
import { useProjectFormSubmit } from "@/modules/projects/forms/useProjectFormSubmit";
import { projectRoutes } from "@/utils/routes/project.routes";

export function ProjectCreateContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canCreateProject } = useProjectContext();
  const form = useProjectForm();
  const { submit, isLoading } = useProjectFormSubmit(form);

  // Permission check (AFTER all hooks)
  if (!canCreateProject) {
    return (
      <AccessDenied message="You do not have permission to create projects." />
    );
  }

  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    await submit(values);
  };

  const handleCancel = () => {
    router.push(projectRoutes.company.list);
  };

  return (
    <ProjectCreateForm
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={handleCancel}
    />
  );
}


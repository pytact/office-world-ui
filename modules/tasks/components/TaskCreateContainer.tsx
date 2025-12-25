// Task Create Container
// SCR_TASK_CREATE - Container component following R7
// Handles business logic, hooks, and state management
// Following R10: Form logic in hooks, container orchestrates

"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { TaskCreateForm } from "./TaskCreateForm";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useTaskContext } from "@/context/TaskContext";
import { useTaskForm, useTaskFormSubmit } from "@/modules/tasks/forms";
import { useListProjects } from "@/hooks/useProjects";

export function TaskCreateContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canCreateTask } = useTaskContext();
  const form = useTaskForm();
  const { submit, isLoading } = useTaskFormSubmit(form);
  const projectsQuery = useListProjects({ status: "ACTIVE" });

  // Get active projects for selector - MUST be before early returns
  const activeProjects = useMemo(() => {
    return projectsQuery.data?.data?.items || [];
  }, [projectsQuery.data?.data?.items]);

  // Handle cancel - MUST be before early returns
  const handleCancel = useCallback(() => {
    // Navigation handled by submit hook on success
    // For cancel, navigate back to list
    router.push("/company/tasks");
  }, [router]);

  // Handle submit - MUST be before early returns
  const handleSubmit = async (values: Parameters<typeof submit>[0]) => {
    await submit(values);
  };

  // Permission check (AFTER all hooks)
  if (!canCreateTask) {
    return (
      <AccessDenied message="You do not have permission to create tasks." />
    );
  }

  return (
    <TaskCreateForm
      form={form}
      projects={activeProjects}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      onCancel={handleCancel}
    />
  );
}


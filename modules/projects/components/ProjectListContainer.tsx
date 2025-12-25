// Project List Container
// SCR_PROJECT_LIST - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ProjectList } from "./ProjectList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useProjectListData } from "@/hooks/useProjectListData";
import { useProjectContext } from "@/context/ProjectContext";
import { projectRoutes } from "@/utils/routes/project.routes";

export function ProjectListContainer() {
  const router = useRouter();
  const { canViewAllProjects, canCreateProject } = useProjectContext();
  const {
    isLoading,
    isError,
    error,
    refetch,
    projects,
    pagination,
    filters,
    paginationControls,
  } = useProjectListData();

  // Permission check
  if (!canViewAllProjects) {
    return (
      <EmptyState
        message="No projects available"
        description="You don't have permission to view projects or there are no projects with assigned tasks."
      />
    );
  }

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load projects"}
        onRetry={refetch}
      />
    );
  }

  // Empty state - R17: Enhanced with clear guidance and next steps
  if (!projects || projects.length === 0) {
    return (
      <div style={{ padding: "48px 24px", maxWidth: "800px", margin: "0 auto" }}>
        <EmptyState
          message={
            filters.hasActiveFilters
              ? "No projects match your filters"
              : "No projects found"
          }
          description={
            filters.hasActiveFilters
              ? "Try adjusting your search or filter criteria to see more results."
              : canCreateProject
              ? "Projects help you organize and track tasks. Create your first project to get started."
              : "No projects are available at this time. Contact your manager if you need access to projects."
          }
          actionText={
            filters.hasActiveFilters
              ? "Clear Filters"
              : canCreateProject
              ? "Create Your First Project"
              : undefined
          }
          onActionClick={
            filters.hasActiveFilters
              ? filters.resetFilters
              : canCreateProject
              ? () => router.push(projectRoutes.company.create)
              : undefined
          }
        />
      </div>
    );
  }

  // Success state
  const handleProjectClick = (projectId: string) => {
    router.push(projectRoutes.company.detail(projectId));
  };

  return (
    <ProjectList
      projects={projects}
      filters={filters}
      pagination={pagination}
      paginationControls={paginationControls}
      canCreateProject={canCreateProject}
      onProjectClick={handleProjectClick}
    />
  );
}


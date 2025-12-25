// Task List Container
// SCR_TASK_LIST - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { TaskList } from "./TaskList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useTaskListData } from "@/hooks/useTaskListData";
import { useTaskContext } from "@/context/TaskContext";

export function TaskListContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canViewAllTasks, canCreateTask } = useTaskContext();
  const {
    isLoading,
    isError,
    error,
    refetch,
    tasks,
    pagination,
    filters,
    paginationControls,
  } = useTaskListData();

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: "48px 24px",
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // Loading state (AFTER all hooks)
  if (isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load tasks"}
        onRetry={refetch}
      />
    );
  }

  // Empty state - R17: Enhanced with clear guidance and next steps
  if (!tasks || tasks.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message={
            filters.hasActiveFilters
              ? "No tasks match your filters"
              : "No tasks found"
          }
          description={
            filters.hasActiveFilters
              ? "Try adjusting your search or filter criteria to see more results."
              : canCreateTask
              ? "Tasks help you organize and track work. Create your first task to get started."
              : "No tasks are available at this time."
          }
          actionText={
            filters.hasActiveFilters
              ? "Clear Filters"
              : canCreateTask
              ? "Create Your First Task"
              : undefined
          }
          onActionClick={
            filters.hasActiveFilters
              ? filters.resetFilters
              : canCreateTask
              ? () => router.push("/company/tasks/create")
              : undefined
          }
        />
      </div>
    );
  }

  // Success state
  const handleTaskClick = (taskId: string) => {
    router.push(`/company/tasks/${taskId}`);
  };

  return (
    <TaskList
      tasks={tasks}
      filters={filters}
      pagination={pagination}
      paginationControls={paginationControls}
      canCreateTask={canCreateTask}
      onTaskClick={handleTaskClick}
    />
  );
}


// Project Task List Component
// Screen UI component - R16 Layer 3
// Task list section for project detail view

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskSummaryItem } from "./TaskSummaryItem";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TaskSummary } from "@/utils/types/responses/project";

interface ProjectTaskListProps {
  tasks: TaskSummary[] | undefined;
  projectName: string;
}

/**
 * Project Task List Component
 * Displays tasks associated with the project
 * Following R17: Secondary section, clear task display
 * Following R14: Memoized for performance
 */
export const ProjectTaskList = React.memo(function ProjectTaskList({
  tasks,
  projectName,
}: ProjectTaskListProps) {
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

  if (!tasks || tasks.length === 0) {
    return (
      <Card variant="default" padding="md" style={containerStyle}>
        <h2 style={titleStyle}>Tasks</h2>
        <EmptyState
          message="No tasks assigned"
          description={`This project doesn't have any tasks yet. Tasks can be assigned to this project from the task management section.`}
        />
      </Card>
    );
  }

  return (
    <Card variant="default" padding="md" style={containerStyle}>
      <h2 style={titleStyle}>Tasks ({tasks.length})</h2>
      <div>
        {tasks.map((task) => (
          <TaskSummaryItem key={task.id} task={task} />
        ))}
      </div>
    </Card>
  );
});


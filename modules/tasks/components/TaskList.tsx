// Task List Component
// Screen UI component - R16 Layer 3
// Pure UI component for task list screen
// Following R17: Monitoring Screen with clear visual hierarchy

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { TaskTable } from "./TaskTable";
import { TaskFilters } from "./TaskFilters";
import { TaskPagination } from "./TaskPagination";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";
import type { useTaskListData } from "@/hooks/useTaskListData";
import type { useTaskFilters } from "@/hooks/useTaskFilters";
import type { useTaskPagination } from "@/hooks/useTaskPagination";
import type { TransformedTaskSummary } from "@/hooks/useTaskTransformations";

interface TaskListProps {
  tasks: TransformedTaskSummary[];
  filters: ReturnType<typeof useTaskFilters>;
  pagination: ReturnType<typeof useTaskListData>["pagination"];
  paginationControls: ReturnType<typeof useTaskPagination>;
  canCreateTask: boolean;
  onTaskClick: (taskId: string) => void;
}

/**
 * Task List Component
 * Main UI for task list screen
 * Following R17: Primary action (table), Secondary action (create button)
 * Following R14: Memoized for performance
 */
export const TaskList = React.memo(function TaskList({
  tasks,
  filters,
  pagination,
  paginationControls,
  canCreateTask,
  onTaskClick,
}: TaskListProps) {
  const router = useRouter();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const handleCreateClick = useCallback(() => {
    router.push("/company/tasks/create");
  }, [router]);

  const toggleFilters = useCallback(() => {
    setFiltersExpanded((prev) => !prev);
  }, []);

  // R17: Visual Hierarchy Styles
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[8],
      padding: `${spacing[6]} ${spacing[4]}`,
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  // Primary: Header Section
  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing[2],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
      lineHeight: typography.lineHeight.h1,
    } as const),
    []
  );

  const subtitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      marginTop: spacing[2],
    } as const),
    []
  );

  // Secondary: Filters Section (Collapsible)
  const filtersHeaderStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: filtersExpanded ? spacing[4] : 0,
    } as const),
    [filtersExpanded]
  );

  const filtersToggleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      cursor: "pointer",
      textDecoration: "none",
      border: "none",
      background: "none",
      padding: 0,
    } as const),
    []
  );

  // Primary: Table Section (Dominant)
  const tableCardStyle = useMemo(
    () => ({
      marginBottom: spacing[4],
      boxShadow: shadows.md,
    } as const),
    []
  );

  const tableHeaderStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[6],
      paddingBottom: spacing[4],
      borderBottom: `2px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
    } as const),
    []
  );

  const taskCountStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* R17: Attention Anchor - Header with Title */}
      <div>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Tasks</h1>
            <p style={subtitleStyle}>
              Manage and track your company tasks
            </p>
          </div>
          {canCreateTask && (
            <Button
              type="button"
              onClick={handleCreateClick}
              variant="primary"
            >
              + Create Task
            </Button>
          )}
        </div>
      </div>

      {/* R17: Secondary - Filters (Collapsible) */}
      <Card variant="outlined" padding="sm">
        <div style={filtersHeaderStyle}>
          <h3 style={sectionTitleStyle}>Filters</h3>
          <button
            type="button"
            onClick={toggleFilters}
            style={filtersToggleStyle}
          >
            {filtersExpanded ? "▲ Hide" : "▼ Show"} Filters
          </button>
        </div>
        {filtersExpanded && <TaskFilters filters={filters} />}
      </Card>

      {/* R17: Primary - Task Table (Dominant Visual Element) */}
      <div>
        <div style={tableHeaderStyle}>
          <h2 style={sectionTitleStyle}>All Tasks</h2>
          <div style={taskCountStyle}>
            Showing {tasks.length} of {pagination.total}
          </div>
        </div>
        <div style={tableCardStyle}>
          <Card variant="default" padding="lg">
            <TaskTable tasks={tasks} onTaskClick={onTaskClick} />
          </Card>
        </div>
      </div>

      {/* R17: Tertiary - Pagination */}
      <TaskPagination
        pagination={pagination}
        paginationControls={paginationControls}
      />
    </div>
  );
});


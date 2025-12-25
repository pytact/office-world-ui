// Project List Component
// Screen UI component - R16 Layer 3
// Pure UI component for project list screen
// Following R17: Monitoring Screen with clear visual hierarchy

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { ProjectTable } from "./ProjectTable";
import { ProjectFilters } from "./ProjectFilters";
import { ProjectPagination } from "./ProjectPagination";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";
import type { useProjectListData } from "@/hooks/useProjectListData";
import type { useProjectFilters } from "@/hooks/useProjectFilters";
import type { useProjectPagination } from "@/hooks/useProjectPagination";
import type { TransformedProjectSummary } from "@/hooks/useProjectTransformations";
import { projectRoutes } from "@/utils/routes/project.routes";

interface ProjectListProps {
  projects: TransformedProjectSummary[];
  filters: ReturnType<typeof useProjectFilters>;
  pagination: ReturnType<typeof useProjectListData>["pagination"];
  paginationControls: ReturnType<typeof useProjectPagination>;
  canCreateProject: boolean;
  onProjectClick: (projectId: string) => void;
}

// Calculate summary stats from projects
function calculateStats(projects: TransformedProjectSummary[]) {
  const total = projects.length;
  const active = projects.filter((p) => p.status === "ACTIVE").length;
  const inactive = projects.filter((p) => p.status === "INACTIVE").length;
  const completed = projects.filter((p) => p.status === "COMPLETED").length;
  const totalTasks = projects.reduce((sum, p) => sum + p.task_count, 0);
  return { total, active, inactive, completed, totalTasks };
}

/**
 * Project List Component
 * Main UI for project list screen
 * Following R17: Primary action (table), Secondary action (create button)
 * Following R14: Memoized for performance
 */
export const ProjectList = React.memo(function ProjectList({
  projects,
  filters,
  pagination,
  paginationControls,
  canCreateProject,
  onProjectClick,
}: ProjectListProps) {
  const router = useRouter();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const stats = useMemo(() => calculateStats(projects), [projects]);

  const handleCreateClick = useCallback(() => {
    router.push(projectRoutes.company.create);
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

  // Primary: Summary Stats (KPI Cards) - Attention Anchor
  const statsGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: spacing[4],
      marginBottom: spacing[2],
    } as const),
    []
  );

  const statCardStyle = useMemo(
    () => ({
      padding: spacing[5],
      backgroundColor: colors.backgroundPrimary,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.borderLight}`,
      boxShadow: shadows.sm,
    } as const),
    []
  );

  const statValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      marginBottom: spacing[1],
      lineHeight: typography.lineHeight.h2,
    } as const),
    []
  );

  const statLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      textTransform: "uppercase" as const,
      letterSpacing: "0.05em",
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

  return (
    <div style={containerStyle}>
      {/* R17: Attention Anchor - Header with Title */}
      <div>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Projects</h1>
            <p style={subtitleStyle}>
              Manage and track your company projects
            </p>
          </div>
          {canCreateProject && (
            <Button
              type="button"
              onClick={handleCreateClick}
              variant="primary"
            >
              + Create Project
            </Button>
          )}
        </div>

        {/* R17: Primary - Summary Stats (KPI Cards) */}
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.total}</div>
            <div style={statLabelStyle}>Total Projects</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.active}</div>
            <div style={statLabelStyle}>Active</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.completed}</div>
            <div style={statLabelStyle}>Completed</div>
          </div>
          <div style={statCardStyle}>
            <div style={statValueStyle}>{stats.totalTasks}</div>
            <div style={statLabelStyle}>Total Tasks</div>
          </div>
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
        {filtersExpanded && <ProjectFilters filters={filters} />}
      </Card>

      {/* R17: Primary - Project Table (Dominant Visual Element) */}
      <div>
        <div style={tableHeaderStyle}>
          <h2 style={sectionTitleStyle}>All Projects</h2>
          <div style={{ fontSize: typography.fontSize.small, color: colors.textMuted }}>
            Showing {projects.length} of {pagination.total}
          </div>
        </div>
        <div style={tableCardStyle}>
          <Card variant="default" padding="lg">
            <ProjectTable projects={projects} onProjectClick={onProjectClick} />
          </Card>
        </div>
      </div>

      {/* R17: Tertiary - Pagination */}
      <ProjectPagination
        pagination={pagination}
        paginationControls={paginationControls}
      />
    </div>
  );
});


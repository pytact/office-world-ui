// Leave List Component
// Screen UI component - R16 Layer 3
// Pure UI component for leave list screen
// Following R17: Monitoring Screen with clear visual hierarchy

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { LeaveTable } from "./LeaveTable";
import { LeaveFilters } from "./LeaveFilters";
import { LeavePagination } from "./LeavePagination";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";
import type { useLeaveListData } from "@/hooks/useLeaveListData";
import type { useLeaveFilters } from "@/hooks/useLeaveFilters";
import type { useLeavePagination } from "@/hooks/useLeavePagination";
import type { TransformedLeaveSummary } from "@/hooks/useLeaveTransformations";
import { leaveRoutes } from "@/utils/routes";

interface LeaveListProps {
  leaves: TransformedLeaveSummary[];
  filters: ReturnType<typeof useLeaveFilters>;
  pagination: ReturnType<typeof useLeaveListData>["pagination"];
  paginationControls: ReturnType<typeof useLeavePagination>;
  canCreateLeave: boolean;
  onLeaveClick: (leaveId: string) => void;
}

/**
 * Leave List Component
 * Main UI for leave list screen
 * Following R17: Primary action (table), Secondary action (create button)
 * Following R14: Memoized for performance
 */
export const LeaveList = React.memo(function LeaveList({
  leaves,
  filters,
  pagination,
  paginationControls,
  canCreateLeave,
  onLeaveClick,
}: LeaveListProps) {
  const router = useRouter();
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const handleCreateClick = useCallback(() => {
    router.push(leaveRoutes.company.create);
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

  // Secondary: Filter Section (Collapsible)
  const filterCardStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const filterHeaderStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      cursor: "pointer",
      borderBottom: filtersExpanded ? `1px solid ${colors.borderDefault}` : "none",
    } as const),
    [filtersExpanded]
  );

  const filterContentStyle = useMemo(
    () => ({
      padding: spacing[4],
    } as const),
    []
  );

  const filterToggleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  // Primary: Table Section
  const tableCardStyle = useMemo(
    () => ({
      boxShadow: shadows.md,
      borderRadius: borderRadius.md,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Leave Requests</h1>
            <p style={subtitleStyle}>
              View and manage leave requests
            </p>
          </div>
          {canCreateLeave && (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleCreateClick}
            >
              Create Leave Request
            </Button>
          )}
        </div>
      </div>

      {/* Secondary: Filter Section (Collapsible) */}
      <div style={filterCardStyle}>
        <Card variant="outlined" padding="md">
          <div style={filterHeaderStyle} onClick={toggleFilters}>
            <span style={filterToggleStyle}>
              {filtersExpanded ? "Hide" : "Show"} Filters
            </span>
            <span style={filterToggleStyle}>
              {filtersExpanded ? "−" : "+"}
            </span>
          </div>
          {filtersExpanded && (
            <div style={filterContentStyle}>
              <LeaveFilters filters={filters} />
            </div>
          )}
        </Card>
      </div>

      {/* Primary: Table Section */}
      <div style={tableCardStyle}>
        <Card variant="elevated" padding="sm">
          <LeaveTable leaves={leaves} onLeaveClick={onLeaveClick} />
        </Card>
      </div>

      {/* Tertiary: Pagination Section */}
      <LeavePagination
        pagination={pagination}
        paginationControls={paginationControls}
      />
    </div>
  );
});


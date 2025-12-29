// Attendance List Component
// Screen UI component - R16 Layer 3
// Pure UI component for attendance list screen
// Following R17: Monitoring Screen with clear visual hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import { AttendanceTable } from "./AttendanceTable";
import { AttendanceFilters } from "./AttendanceFilters";
import { spacing, typography, colors, shadows, borderRadius } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import type { useAttendanceFilters } from "@/hooks/useAttendanceFilters";
import type { useAttendancePagination } from "@/hooks/useAttendancePagination";
import type {
  TransformedAttendanceSummary,
  TransformedCompanyAttendanceSummary,
} from "@/hooks/useAttendanceTransformations";

interface AttendanceListProps {
  attendances: (
    | TransformedAttendanceSummary
    | TransformedCompanyAttendanceSummary
  )[];
  filters: ReturnType<typeof useAttendanceFilters>;
  pagination: ReturnType<typeof useAttendancePagination>;
  showEmployee?: boolean; // For company attendance list
  onAttendanceClick: (attendanceId: string) => void;
}

/**
 * Attendance List Component
 * Main UI for attendance list screen
 * Following R17: Primary action (table), Secondary action (filters)
 */
export const AttendanceList = React.memo(function AttendanceList({
  attendances,
  filters,
  pagination,
  showEmployee = false,
  onAttendanceClick,
}: AttendanceListProps) {
  // R17: Visual Hierarchy Styles
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
      padding: `${spacing[6]} ${spacing[4]}`,
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  // Primary: Header Section
  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[4],
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

  // Secondary: Filter Section
  const filterSectionStyle = useMemo(
    () => ({
      marginBottom: spacing[4],
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

  // Tertiary: Pagination Section
  const paginationStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      padding: spacing[4],
    } as const),
    []
  );

  const paginationInfoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const paginationButtonsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
    } as const),
    []
  );

  // Memoize pagination button styles to prevent re-creation (R15 Issue 3)
  const previousButtonStyle = useMemo(
    () => ({
      padding: `${spacing[2]} ${spacing[4]}`,
      border: `1px solid ${colors.borderDefault}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundPrimary,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const nextButtonStyle = useMemo(
    () => ({
      padding: `${spacing[2]} ${spacing[4]}`,
      border: `1px solid ${colors.borderDefault}`,
      borderRadius: borderRadius.md,
      backgroundColor: colors.backgroundPrimary,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Header Section */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          {showEmployee ? "Company Attendance" : "Attendance History"}
        </h1>
      </div>

      {/* Secondary: Filter Section */}
      <div style={filterSectionStyle}>
        <AttendanceFilters filters={filters} showEmployeeFilter={showEmployee} />
      </div>

      {/* Primary: Table Section */}
      <div style={tableCardStyle}>
        <Card variant="elevated" padding="sm">
          <AttendanceTable
            attendances={attendances}
            onAttendanceClick={onAttendanceClick}
            showEmployee={showEmployee}
          />
        </Card>
      </div>

      {/* Tertiary: Pagination Section */}
      {pagination.totalPages > 0 && (
        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </div>
          <div style={paginationButtonsStyle}>
            <button
              type="button"
              onClick={pagination.previousPage}
              disabled={!pagination.hasPreviousPage}
              style={{
                ...previousButtonStyle,
                cursor: pagination.hasPreviousPage ? "pointer" : "not-allowed",
                opacity: pagination.hasPreviousPage ? 1 : 0.5,
              }}
            >
              Previous
            </button>
            <button
              type="button"
              onClick={pagination.nextPage}
              disabled={!pagination.hasNextPage}
              style={{
                ...nextButtonStyle,
                cursor: pagination.hasNextPage ? "pointer" : "not-allowed",
                opacity: pagination.hasNextPage ? 1 : 0.5,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
});


// Leave Approval Queue Component
// Screen UI component - R16 Layer 3
// Pure UI component for approval queue screen
// Following R17: Decision Screen with focused view

"use client";

import React, { useCallback, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { LeaveTable } from "./LeaveTable";
import { LeavePagination } from "./LeavePagination";
import { spacing, typography, colors, shadows, borderRadius } from "@/theme/tokens";
import type { useLeavePagination } from "@/hooks/useLeavePagination";
import type { TransformedLeaveSummary } from "@/hooks/useLeaveTransformations";

interface LeaveApprovalQueueProps {
  leaves: TransformedLeaveSummary[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
  };
  paginationControls: ReturnType<typeof useLeavePagination>;
  onLeaveClick: (leaveId: string) => void;
}

/**
 * Leave Approval Queue Component
 * Main UI for approval queue screen
 * Following R17: Primary action (table), focused on pending approvals
 * Following R14: Memoized for performance
 */
export const LeaveApprovalQueue = React.memo(function LeaveApprovalQueue({
  leaves,
  pagination,
  paginationControls,
  onLeaveClick,
}: LeaveApprovalQueueProps) {
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
      <div style={headerStyle}>
        <h1 style={titleStyle}>Pending Approvals</h1>
        <p style={subtitleStyle}>
          Review and act on leave requests awaiting your approval
        </p>
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


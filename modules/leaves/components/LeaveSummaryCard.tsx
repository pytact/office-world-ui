// Leave Summary Card Component
// Feature-specific component - R16 Layer 2
// Displays leave summary information
// Following R17: Secondary content area

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedLeaveDetail } from "@/hooks/useLeaveTransformations";

interface LeaveSummaryCardProps {
  leave: TransformedLeaveDetail;
}

/**
 * Leave Summary Card Component
 * Displays key leave information in a card
 * Following R17: Secondary content area
 */
export const LeaveSummaryCard = React.memo(function LeaveSummaryCard({
  leave,
}: LeaveSummaryCardProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      margin: 0,
    } as const),
    []
  );

  const rowStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      padding: `${spacing[2]} 0`,
      borderBottom: `1px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const valueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      textAlign: "right" as const,
    } as const),
    []
  );

  const reasonStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "8px",
      marginTop: spacing[2],
      whiteSpace: "pre-wrap" as const,
    } as const),
    []
  );

  const reasonContainerStyle = useMemo(
    () => ({
      marginTop: spacing[4],
    } as const),
    []
  );

  return (
    <Card variant="default" padding="lg">
      <h3 style={sectionTitleStyle}>Leave Details</h3>
      <div style={containerStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Employee</span>
          <span style={valueStyle}>{leave.employeeFullName}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Leave Type</span>
          <span style={valueStyle}>{leave.leaveTypeLabel}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Date Range</span>
          <span style={valueStyle}>{leave.dateRangeFormatted}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Day Type</span>
          <span style={valueStyle}>{leave.dayTypeLabel}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Duration</span>
          <span style={valueStyle}>{leave.durationLabel}</span>
        </div>
        <div style={reasonContainerStyle}>
          <span style={labelStyle}>Reason</span>
          <div style={reasonStyle}>{leave.reason}</div>
        </div>
      </div>
    </Card>
  );
});


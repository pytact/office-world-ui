// Attendance Summary Card Component
// Feature-specific component - R16 Layer 2
// Displays attendance summary information
// Following R17: Primary attention anchor on detail screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAttendanceResponse } from "@/hooks/useAttendanceTransformations";

interface AttendanceSummaryCardProps {
  attendance: TransformedAttendanceResponse;
  employeeName: string;
}

/**
 * Attendance Summary Card Component
 * Displays key attendance information in a card
 * Following R17: Primary attention anchor on detail screen
 */
export const AttendanceSummaryCard = React.memo(function AttendanceSummaryCard({
  attendance,
  employeeName,
}: AttendanceSummaryCardProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
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

  return (
    <Card variant="default" padding="lg">
      <div style={headerStyle}>
        <h2 style={titleStyle}>{employeeName}</h2>
        <AttendanceStatusBadge status={attendance.status} />
      </div>
      <div style={containerStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Date</span>
          <span style={valueStyle}>{attendance.attendanceDateFormatted}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Check In</span>
          <span style={valueStyle}>
            {attendance.checkInTimeFormatted || "—"}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Check Out</span>
          <span style={valueStyle}>
            {attendance.checkOutTimeFormatted || "—"}
          </span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Worked Time</span>
          <span style={valueStyle}>{attendance.workedTimeFormatted}</span>
        </div>
        {attendance.is_auto_check_out && (
          <div style={rowStyle}>
            <span style={labelStyle}>Auto Check Out</span>
            <span style={valueStyle}>Yes</span>
          </div>
        )}
      </div>
    </Card>
  );
});


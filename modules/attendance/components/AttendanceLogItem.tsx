// Attendance Log Item Component
// Feature-specific component - R16 Layer 2
// Displays a single attendance log entry
// Following R17: Clear chronological display

"use client";

import React, { useMemo } from "react";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAttendanceLog } from "@/hooks/useAttendanceTransformations";

interface AttendanceLogItemProps {
  log: TransformedAttendanceLog;
}

/**
 * Attendance Log Item Component
 * Displays a single log entry in chronological order
 * Following R17: Clear chronological display
 */
export const AttendanceLogItem = React.memo(function AttendanceLogItem({
  log,
}: AttendanceLogItemProps) {
  const containerStyle = useMemo(
    () => ({
      padding: spacing[4],
      borderBottom: `1px solid ${colors.borderDefault}`,
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
    } as const),
    []
  );

  const actionTypeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const timeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const detailStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[1],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={actionTypeStyle}>{log.actionTypeLabel}</span>
        <span style={timeStyle}>{log.actionTimeFormatted}</span>
      </div>
      <div style={detailStyle}>
        {log.location && <span>Location: {log.location}</span>}
        {log.device_info && <span>Device: {log.device_info}</span>}
        {log.is_auto_action && <span>Auto Action</span>}
        {log.notes && <span>Notes: {log.notes}</span>}
      </div>
    </div>
  );
});


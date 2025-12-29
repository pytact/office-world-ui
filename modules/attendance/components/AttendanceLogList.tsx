// Attendance Log List Component
// Feature-specific component - R16 Layer 2
// Displays list of attendance logs
// Following R17: Secondary content area, chronological order

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { AttendanceLogItem } from "./AttendanceLogItem";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAttendanceLog } from "@/hooks/useAttendanceTransformations";

interface AttendanceLogListProps {
  logs: TransformedAttendanceLog[];
}

/**
 * Attendance Log List Component
 * Displays attendance logs in chronological order
 * Following R17: Secondary content area
 * Following R14: Memoized for performance
 */
export const AttendanceLogList = React.memo(function AttendanceLogList({
  logs,
}: AttendanceLogListProps) {
  // Memoize style objects to prevent re-creation on every render (R15 Issue 3)
  const titleStyle = useMemo(
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

  const emptyStyle = useMemo(
    () => ({
      padding: spacing[6],
      textAlign: "center" as const,
      color: colors.textMuted,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  return (
    <Card variant="default" padding="lg">
      <h3 style={titleStyle}>Attendance Logs</h3>
      {logs.length === 0 ? (
        <div style={emptyStyle}>No logs available</div>
      ) : (
        <div>
          {logs.map((log) => (
            <AttendanceLogItem key={log.id} log={log} />
          ))}
        </div>
      )}
    </Card>
  );
});


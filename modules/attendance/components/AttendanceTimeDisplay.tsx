// Attendance Time Display Component
// Feature-specific component - R16 Layer 2
// Displays live worked time counter or final worked time
// Following R17: Primary attention anchor, prominent display

"use client";

import React, { useMemo } from "react";
import { typography, spacing, colors } from "@/theme/tokens";

interface AttendanceTimeDisplayProps {
  liveWorkedTime: string | null; // Formatted duration (e.g., "9h 29m")
  finalWorkedTime: string | null; // Final worked time from API
  isRunning: boolean; // Whether counter is currently running
  className?: string;
}

/**
 * Attendance Time Display
 * Shows live counter (if checked in) or final worked time (if checked out)
 * Following R17: Primary attention anchor, large prominent display
 * Following R14: Memoized for performance
 */
export const AttendanceTimeDisplay = React.memo(function AttendanceTimeDisplay({
  liveWorkedTime,
  finalWorkedTime,
  isRunning,
  className = "",
}: AttendanceTimeDisplayProps) {
  const displayTime = liveWorkedTime || finalWorkedTime || "0h 0m";
  const showLiveIndicator = isRunning && liveWorkedTime !== null;

  // Memoize styles to prevent re-creation on every render (R14, R15)
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const timeStyle = useMemo(
    () => ({
      fontSize: "3rem",
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      lineHeight: 1.2,
    } as const),
    []
  );

  const liveIndicatorStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textSecondary,
      display: "flex",
      alignItems: "center" as const,
      gap: spacing[1],
    } as const),
    []
  );

  const liveDotStyle = useMemo(
    () => ({
      width: spacing[2],
      height: spacing[2],
      borderRadius: "50%",
      backgroundColor: colors.success,
      display: "inline-block",
    } as const),
    []
  );

  return (
    <div className={className} style={containerStyle}>
      <div style={timeStyle}>{displayTime}</div>
      {showLiveIndicator && (
        <div style={liveIndicatorStyle}>
          <span style={liveDotStyle} />
          Live
        </div>
      )}
    </div>
  );
});


// Attendance Today Component
// UI Component - Pure rendering only
// Following R7: No business logic, hooks, or API calls
// Following R17: Primary action obvious, live counter prominent

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { AttendanceTimeDisplay } from "./AttendanceTimeDisplay";
import { spacing, typography, colors } from "@/theme/tokens";
import type { AttendanceResponse } from "@/utils/types/responses/attendance";

interface AttendanceTodayProps {
  attendance: AttendanceResponse | null;
  liveWorkedTime: string | null;
  liveWorkedTimeSeconds: number | null;
  isRunning: boolean;
  canCheckIn: boolean;
  canCheckOut: boolean;
  isReadOnly: boolean;
  onCheckIn: () => void;
  onCheckOut: () => void;
  isCheckingIn: boolean;
  isCheckingOut: boolean;
  attendanceDateFormatted: string;
  checkInTimeFormatted: string | null;
  checkOutTimeFormatted: string | null;
  workedTimeFormatted: string;
}

/**
 * Attendance Today Component
 * Pure UI component for today's attendance screen
 * Following R17: Primary action obvious, live counter prominent
 * Following R14: Memoized for performance
 */
export const AttendanceToday = React.memo(function AttendanceToday({
  attendance,
  liveWorkedTime,
  liveWorkedTimeSeconds,
  isRunning,
  canCheckIn,
  canCheckOut,
  isReadOnly,
  onCheckIn,
  onCheckOut,
  isCheckingIn,
  isCheckingOut,
  attendanceDateFormatted,
  checkInTimeFormatted,
  checkOutTimeFormatted,
  workedTimeFormatted,
}: AttendanceTodayProps) {
  // Memoize all style objects to prevent re-creation on every render (R15 Issue 3)
  const cardStyle = React.useMemo(
    () => ({
      maxWidth: "600px",
      margin: "0 auto",
    } as const),
    []
  );

  const headerStyle = React.useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: spacing[6],
    } as const),
    []
  );

  const titleStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
    } as const),
    []
  );

  const timeDisplayContainerStyle = React.useMemo(
    () => ({
      marginBottom: spacing[8],
      padding: spacing[6],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "4px",
    } as const),
    []
  );

  const actionContainerStyle = React.useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
      marginBottom: spacing[6],
    } as const),
    []
  );

  const infoSectionStyle = React.useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
      paddingTop: spacing[4],
      borderTop: `1px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  const infoRowStyle = React.useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const infoLabelStyle = React.useMemo(
    () => ({
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  const infoValueStyle = React.useMemo(
    () => ({
      color: colors.textPrimary,
    } as const),
    []
  );

  const readOnlyMessageStyle = React.useMemo(
    () => ({
      padding: spacing[4],
      textAlign: "center" as const,
      color: colors.textMuted,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  return (
    <div style={cardStyle}>
      <Card variant="default" padding="lg">
        <div style={headerStyle}>
          <h1 style={titleStyle}>Today's Attendance</h1>
          {attendance && (
            <AttendanceStatusBadge status={attendance.status} />
          )}
        </div>

        <div style={timeDisplayContainerStyle}>
          <AttendanceTimeDisplay
            liveWorkedTime={liveWorkedTime}
            finalWorkedTime={attendance?.worked_time || null}
            isRunning={isRunning}
          />
        </div>

        <div style={actionContainerStyle}>
          {canCheckIn && (
            <Button
              variant="primary"
              size="lg"
              onClick={onCheckIn}
              isLoading={isCheckingIn}
              disabled={isCheckingIn || isCheckingOut}
            >
              Check In
            </Button>
          )}
          {canCheckOut && (
            <Button
              variant="primary"
              size="lg"
              onClick={onCheckOut}
              isLoading={isCheckingOut}
              disabled={isCheckingIn || isCheckingOut}
            >
              Check Out
            </Button>
          )}
          {isReadOnly && (
            <div style={readOnlyMessageStyle}>
              Attendance finalized for today
            </div>
          )}
        </div>

        {attendance && (
          <div style={infoSectionStyle}>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Date:</span>
              <span style={infoValueStyle}>{attendanceDateFormatted}</span>
            </div>
            {checkInTimeFormatted && (
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Check In:</span>
                <span style={infoValueStyle}>{checkInTimeFormatted}</span>
              </div>
            )}
            {checkOutTimeFormatted && (
              <div style={infoRowStyle}>
                <span style={infoLabelStyle}>Check Out:</span>
                <span style={infoValueStyle}>{checkOutTimeFormatted}</span>
              </div>
            )}
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>Worked Time:</span>
              <span style={infoValueStyle}>{workedTimeFormatted}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
});


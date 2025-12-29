// Attendance Detail Component
// Screen UI component - R16 Layer 3
// Pure UI component for attendance detail screen
// Following R17: Monitoring Screen, read-only

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AttendanceSummaryCard } from "./AttendanceSummaryCard";
import { AttendanceLogList } from "./AttendanceLogList";
import { spacing } from "@/theme/tokens";
import type { TransformedAttendanceResponse } from "@/hooks/useAttendanceTransformations";
import type { TransformedAttendanceLog } from "@/hooks/useAttendanceTransformations";

interface AttendanceDetailProps {
  attendance: TransformedAttendanceResponse;
  employeeName: string;
  logs: TransformedAttendanceLog[];
  onBack: () => void;
}

/**
 * Attendance Detail Component
 * Main UI for attendance detail screen
 * Following R17: Primary (summary card), Secondary (logs)
 */
export const AttendanceDetail = React.memo(function AttendanceDetail({
  attendance,
  employeeName,
  logs,
  onBack,
}: AttendanceDetailProps) {
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backButtonContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const contentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={backButtonContainerStyle}>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Attendance List
        </Button>
      </div>

      <div style={contentStyle}>
        {/* Primary: Summary Card */}
        <AttendanceSummaryCard
          attendance={attendance}
          employeeName={employeeName}
        />

        {/* Secondary: Logs List */}
        <AttendanceLogList logs={logs} />
      </div>
    </div>
  );
});


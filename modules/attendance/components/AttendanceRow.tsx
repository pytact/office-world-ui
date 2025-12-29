// Attendance Row Component
// Feature-specific component - R16 Layer 2
// Composes TableRow for attendance list display
// Following R17: Clickable row with clear visual hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { AttendanceStatusBadge } from "./AttendanceStatusBadge";
import { colors, typography } from "@/theme/tokens";
import type { TransformedAttendanceSummary, TransformedCompanyAttendanceSummary } from "@/hooks/useAttendanceTransformations";

interface AttendanceRowProps {
  attendance: TransformedAttendanceSummary | TransformedCompanyAttendanceSummary;
  onClick: (attendanceId: string) => void;
  showEmployee?: boolean; // For company attendance list
}

/**
 * Attendance Row Component
 * Displays a single attendance record in the list table
 * Following R17: Clickable row with clear visual hierarchy
 */
export const AttendanceRow = React.memo(function AttendanceRow({
  attendance,
  onClick,
  showEmployee = false,
}: AttendanceRowProps) {
  const handleClick = useCallback(() => {
    onClick(attendance.id);
  }, [attendance.id, onClick]);

  // Memoized styles for performance (R15)
  const nameCellStyle = useMemo(
    () => ({
      color: colors.primary,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      cursor: "pointer",
    } as const),
    []
  );

  const textStyle = useMemo(
    () => ({
      color: colors.textMuted,
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const isCompanyAttendance = "employee" in attendance;

  return (
    <TableRow onClick={handleClick} hover>
      {showEmployee && isCompanyAttendance && (
        <TableCell>
          <span style={nameCellStyle}>
            {attendance.employee.fullName}
          </span>
        </TableCell>
      )}
      <TableCell>
        <span style={textStyle}>{attendance.attendanceDateFormatted}</span>
      </TableCell>
      {!isCompanyAttendance && (
        <>
          <TableCell>
            <span style={textStyle}>
              {attendance.checkInTimeFormatted || "—"}
            </span>
          </TableCell>
          <TableCell>
            <span style={textStyle}>
              {attendance.checkOutTimeFormatted || "—"}
            </span>
          </TableCell>
        </>
      )}
      <TableCell>
        <AttendanceStatusBadge status={attendance.status} />
      </TableCell>
      <TableCell>
        <span style={textStyle}>{attendance.workedTimeFormatted}</span>
      </TableCell>
    </TableRow>
  );
});


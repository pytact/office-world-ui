// Attendance Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for attendance list
// Following R17: Primary visual element, clear hierarchy

"use client";

import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { AttendanceRow } from "./AttendanceRow";
import type {
  TransformedAttendanceSummary,
  TransformedCompanyAttendanceSummary,
} from "@/hooks/useAttendanceTransformations";

interface AttendanceTableProps {
  attendances: (
    | TransformedAttendanceSummary
    | TransformedCompanyAttendanceSummary
  )[];
  onAttendanceClick: (attendanceId: string) => void;
  showEmployee?: boolean; // For company attendance list
}

/**
 * Attendance Table Component
 * Table display for attendance list
 * Following R17: Primary visual element, clear hierarchy
 */
export const AttendanceTable = React.memo(function AttendanceTable({
  attendances,
  onAttendanceClick,
  showEmployee = false,
}: AttendanceTableProps) {
  const handleAttendanceClick = useCallback(
    (attendanceId: string) => {
      onAttendanceClick(attendanceId);
    },
    [onAttendanceClick]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          {showEmployee && <TableCell header>Employee</TableCell>}
          <TableCell header>Date</TableCell>
          {!showEmployee && (
            <>
              <TableCell header>Check In</TableCell>
              <TableCell header>Check Out</TableCell>
            </>
          )}
          <TableCell header>Status</TableCell>
          <TableCell header>Worked Time</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {attendances.map((attendance) => (
          <AttendanceRow
            key={attendance.id}
            attendance={attendance}
            onClick={handleAttendanceClick}
            showEmployee={showEmployee}
          />
        ))}
      </TableBody>
    </Table>
  );
});


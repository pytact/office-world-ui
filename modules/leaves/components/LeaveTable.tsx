// Leave Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for leave list
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
import { LeaveRow } from "./LeaveRow";
import type { TransformedLeaveSummary } from "@/hooks/useLeaveTransformations";

interface LeaveTableProps {
  leaves: TransformedLeaveSummary[];
  onLeaveClick: (leaveId: string) => void;
}

/**
 * Leave Table Component
 * Table display for leave list
 * Following R17: Primary visual element, clear hierarchy
 */
export const LeaveTable = React.memo(function LeaveTable({
  leaves,
  onLeaveClick,
}: LeaveTableProps) {
  const handleLeaveClick = useCallback(
    (leaveId: string) => {
      onLeaveClick(leaveId);
    },
    [onLeaveClick]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          <TableCell header>Employee</TableCell>
          <TableCell header>Leave Type</TableCell>
          <TableCell header>Date Range</TableCell>
          <TableCell header>Duration</TableCell>
          <TableCell header>Status</TableCell>
          <TableCell header>Created</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leaves.map((leave) => (
          <LeaveRow
            key={leave.id}
            leave={leave}
            onClick={handleLeaveClick}
          />
        ))}
      </TableBody>
    </Table>
  );
});


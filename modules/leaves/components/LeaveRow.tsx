// Leave Row Component
// Feature-specific component - R16 Layer 2
// Composes TableRow + Badge for leave list display
// Following R17: Clickable row with clear visual hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import { TableRow, TableCell } from "@/components/ui/Table";
import { LeaveStatusBadge } from "./LeaveStatusBadge";
import { colors, typography, spacing } from "@/theme/tokens";
import type { TransformedLeaveSummary } from "@/hooks/useLeaveTransformations";

interface LeaveRowProps {
  leave: TransformedLeaveSummary;
  onClick: (leaveId: string) => void;
}

/**
 * Leave Row Component
 * Displays a single leave in the list table
 * Following R17: Clickable row with clear visual hierarchy
 */
export const LeaveRow = React.memo(function LeaveRow({
  leave,
  onClick,
}: LeaveRowProps) {
  const handleClick = useCallback(() => {
    onClick(leave.id);
  }, [leave.id, onClick]);

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

  // Determine which status to show (prioritize HR status if manager approved)
  const displayStatus = useMemo(() => {
    if (leave.manager_status === "APPROVED_MANAGER") {
      return leave.hr_status;
    }
    return leave.manager_status;
  }, [leave.manager_status, leave.hr_status]);

  return (
    <TableRow onClick={handleClick} hover>
      <TableCell>
        <span style={nameCellStyle}>{leave.employee.fullName}</span>
      </TableCell>
      <TableCell>
        <span style={textStyle}>{leave.leaveTypeLabel}</span>
      </TableCell>
      <TableCell>
        <span style={textStyle}>{leave.dateRangeFormatted}</span>
      </TableCell>
      <TableCell>
        <span style={textStyle}>{leave.durationLabel}</span>
      </TableCell>
      <TableCell>
        <LeaveStatusBadge status={displayStatus} />
      </TableCell>
      <TableCell>
        <span style={textStyle}>{leave.createdAtFormatted}</span>
      </TableCell>
    </TableRow>
  );
});


// Attendance Status Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with attendance-specific status mapping
// Following R17: Clear visual status indication

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { AttendanceStatus } from "@/utils/types/requests/attendance";
import {
  getAttendanceStatusLabel,
  getAttendanceStatusColor,
} from "@/hooks/useAttendanceTransformations";

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus;
  className?: string;
}

/**
 * Attendance Status Badge
 * Maps attendance status to appropriate badge variant and label
 * Following R17: Clear visual status indication
 * Following R14: Memoized for performance
 */
export const AttendanceStatusBadge = React.memo(function AttendanceStatusBadge({
  status,
  className = "",
}: AttendanceStatusBadgeProps) {
  const statusConfig = useMemo(() => {
    const configs: Record<
      AttendanceStatus,
      { variant: "default" | "success" | "warning" | "error" | "info"; label: string }
    > = {
      NOT_STARTED: {
        variant: "default",
        label: getAttendanceStatusLabel(status),
      },
      CHECKED_IN: {
        variant: "info",
        label: getAttendanceStatusLabel(status),
      },
      CHECKED_OUT: {
        variant: "success",
        label: getAttendanceStatusLabel(status),
      },
    };
    return configs[status];
  }, [status]);

  return (
    <Badge variant={statusConfig.variant} className={className}>
      {statusConfig.label}
    </Badge>
  );
});


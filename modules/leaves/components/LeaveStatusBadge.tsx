// Leave Status Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with leave-specific status mapping
// Following R17: Clear visual status indication

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { LeaveStatus } from "@/utils/types/requests/leave";
import { getLeaveStatusLabel, getLeaveStatusColor } from "@/hooks/useLeaveTransformations";

interface LeaveStatusBadgeProps {
  status: LeaveStatus;
  className?: string;
}

/**
 * Leave Status Badge
 * Maps leave status to appropriate badge variant and label
 * Following R17: Clear visual status indication
 * Following R14: Memoized for performance
 */
export const LeaveStatusBadge = React.memo(function LeaveStatusBadge({
  status,
  className = "",
}: LeaveStatusBadgeProps) {
  const statusConfig = useMemo(() => {
    const configs: Record<
      LeaveStatus,
      { variant: "default" | "success" | "warning" | "error" | "info"; label: string }
    > = {
      PENDING_MANAGER: {
        variant: "warning",
        label: getLeaveStatusLabel(status),
      },
      APPROVED_MANAGER: {
        variant: "info",
        label: getLeaveStatusLabel(status),
      },
      REJECTED_MANAGER: {
        variant: "error",
        label: getLeaveStatusLabel(status),
      },
      PENDING_HR: {
        variant: "warning",
        label: getLeaveStatusLabel(status),
      },
      APPROVED_HR: {
        variant: "success",
        label: getLeaveStatusLabel(status),
      },
      REJECTED_HR: {
        variant: "error",
        label: getLeaveStatusLabel(status),
      },
      CANCELLED: {
        variant: "default",
        label: getLeaveStatusLabel(status),
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


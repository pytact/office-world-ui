// Audit Log Action Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with audit log action code mapping
// Following R17: Clear visual action indication

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatActionCode } from "@/hooks/useAuditLogTransformations";

interface AuditLogActionBadgeProps {
  actionCode: string;
  className?: string;
}

/**
 * Action Code to Badge Variant Mapping
 * Maps action codes to appropriate badge variants for visual distinction
 */
const ACTION_CODE_VARIANTS: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  // User Management
  USER_INVITED: "info",
  ROLE_ASSIGNED: "info",
  
  // Task Management
  TASK_CREATED: "success",
  TASK_UPDATED: "info",
  TASK_DELETED: "error",
  
  // Leave Management
  LEAVE_APPROVED: "success",
  LEAVE_REJECTED: "error",
  
  // Salary Management
  SALARY_UPDATED: "warning",
  
  // Attendance
  ATTENDANCE_CHECK_IN: "success",
  ATTENDANCE_CHECK_OUT: "success",
  SYSTEM_AUTO_CHECK_OUT: "default",
  
  // Default fallback
  DEFAULT: "default",
};

/**
 * Audit Log Action Badge
 * Maps action code to appropriate badge variant and human-readable label
 * Following R17: Clear visual action indication
 */
export const AuditLogActionBadge = React.memo(function AuditLogActionBadge({
  actionCode,
  className = "",
}: AuditLogActionBadgeProps) {
  const badgeConfig = useMemo(() => {
    const variant = ACTION_CODE_VARIANTS[actionCode] || ACTION_CODE_VARIANTS.DEFAULT;
    const label = formatActionCode(actionCode);
    
    return { variant, label };
  }, [actionCode]);

  return (
    <Badge variant={badgeConfig.variant} className={className}>
      {badgeConfig.label}
    </Badge>
  );
});


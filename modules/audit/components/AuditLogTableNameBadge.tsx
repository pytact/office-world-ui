// Audit Log Table Name Badge Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives (Badge) with audit log table name mapping
// Following R17: Clear visual entity indication

"use client";

import React, { useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { formatTableName } from "@/hooks/useAuditLogTransformations";

interface AuditLogTableNameBadgeProps {
  tableName: string;
  className?: string;
}

/**
 * Audit Log Table Name Badge
 * Maps table name to human-readable entity name with default badge variant
 * Following R17: Clear visual entity indication
 */
export const AuditLogTableNameBadge = React.memo(function AuditLogTableNameBadge({
  tableName,
  className = "",
}: AuditLogTableNameBadgeProps) {
  const label = useMemo(() => {
    return formatTableName(tableName);
  }, [tableName]);

  return (
    <Badge variant="default" className={className}>
      {label}
    </Badge>
  );
});


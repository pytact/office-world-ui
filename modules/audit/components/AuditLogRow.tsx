// Audit Log Row Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for single audit log row
// Following R17: Clickable row for primary action (view details)

"use client";

import React, { useCallback, useMemo } from "react";
import {
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { AuditLogTableNameBadge } from "./AuditLogTableNameBadge";
import { colors, spacing, typography } from "@/theme/tokens";
import type { TransformedAuditLogSummary } from "@/hooks/useAuditLogTransformations";

interface AuditLogRowProps {
  auditLog: TransformedAuditLogSummary;
  onClick: (auditLogId: string) => void;
}

/**
 * Audit Log Row Component
 * Single row in audit log table
 * Following R17: Clickable row for primary action (view details)
 */
export const AuditLogRow = React.memo(function AuditLogRow({
  auditLog,
  onClick,
}: AuditLogRowProps) {
  const handleClick = useCallback(() => {
    onClick(auditLog.id);
  }, [auditLog.id, onClick]);

  // Note: TableRow component already handles hover and onClick styling
  // No need for custom style props

  const timeCellContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[1],
    }),
    []
  );

  const relativeTimeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    }),
    []
  );

  const absoluteTimeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.caption,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
    }),
    []
  );

  const emptyDescriptionStyle = useMemo(
    () => ({
      color: colors.textMuted,
      fontStyle: "italic" as const,
      fontFamily: typography.fontFamily,
    }),
    []
  );

  return (
    <TableRow onClick={handleClick} hover>
      <TableCell>
        <AuditLogActionBadge actionCode={auditLog.action_code} />
      </TableCell>
      <TableCell>
        <AuditLogTableNameBadge tableName={auditLog.table_name} />
      </TableCell>
      <TableCell>
        {auditLog.actorDisplayNameFormatted}
      </TableCell>
      <TableCell>
        <div style={timeCellContainerStyle}>
          <span style={relativeTimeStyle}>
            {auditLog.createdAtRelative}
          </span>
          <span style={absoluteTimeStyle}>
            {auditLog.createdAtAbsolute}
          </span>
        </div>
      </TableCell>
      <TableCell>
        {auditLog.description || (
          <span style={emptyDescriptionStyle}>
            No description
          </span>
        )}
      </TableCell>
    </TableRow>
  );
});


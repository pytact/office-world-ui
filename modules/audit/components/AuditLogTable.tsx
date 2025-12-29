// Audit Log Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for audit log list
// Following R17: Primary visual element, clear hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { AuditLogRow } from "./AuditLogRow";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAuditLogSummary } from "@/hooks/useAuditLogTransformations";

interface AuditLogTableProps {
  auditLogs: TransformedAuditLogSummary[];
  onAuditLogClick: (auditLogId: string) => void;
}

/**
 * Audit Log Table Component
 * Table display for audit log list
 * Following R17: Primary visual element, clear hierarchy
 */
export const AuditLogTable = React.memo(function AuditLogTable({
  auditLogs,
  onAuditLogClick,
}: AuditLogTableProps) {
  const handleAuditLogClick = useCallback(
    (auditLogId: string) => {
      onAuditLogClick(auditLogId);
    },
    [onAuditLogClick]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell header>
            Action
          </TableCell>
          <TableCell header>
            Entity
          </TableCell>
          <TableCell header>
            Actor
          </TableCell>
          <TableCell header>
            Time
          </TableCell>
          <TableCell header>
            Description
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {auditLogs.map((auditLog) => (
          <AuditLogRow
            key={auditLog.id}
            auditLog={auditLog}
            onClick={handleAuditLogClick}
          />
        ))}
      </TableBody>
    </Table>
  );
});


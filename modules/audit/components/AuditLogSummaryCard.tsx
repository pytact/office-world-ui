// Audit Log Summary Card Component
// Feature-specific component - R16 Layer 2
// Displays audit log summary information
// Following R17: Secondary attention anchor on detail screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { AuditLogTableNameBadge } from "./AuditLogTableNameBadge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAuditLogDetail } from "@/hooks/useAuditLogTransformations";

interface AuditLogSummaryCardProps {
  auditLog: TransformedAuditLogDetail;
}

/**
 * Audit Log Summary Card Component
 * Displays key audit log information in a card
 * Following R17: Secondary attention anchor on detail screen
 */
export const AuditLogSummaryCard = React.memo(function AuditLogSummaryCard({
  auditLog,
}: AuditLogSummaryCardProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: spacing[2],
      flexWrap: "wrap" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
    } as const),
    []
  );

  const rowStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      padding: `${spacing[2]} 0`,
      borderBottom: `1px solid ${colors.borderLight}`,
      gap: spacing[4],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      flex: "0 0 120px" as const,
    } as const),
    []
  );

  const valueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      textAlign: "right" as const,
      flex: "1 1 auto" as const,
    } as const),
    []
  );

  const descriptionStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      fontStyle: "italic" as const,
    } as const),
    []
  );

  const badgeContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const timestampContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[1],
      textAlign: "right" as const,
    } as const),
    []
  );

  const timestampRelativeStyle = useMemo(
    () => ({
      ...valueStyle,
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
    }),
    [valueStyle]
  );

  const descriptionRowStyle = useMemo(
    () => ({
      ...rowStyle,
      borderBottom: "none",
      flexDirection: "column" as const,
      alignItems: "flex-start" as const,
    }),
    [rowStyle]
  );

  return (
    <Card variant="default" padding="lg">
      <div style={headerStyle}>
        <h3 style={titleStyle}>Audit Summary</h3>
        <div style={badgeContainerStyle}>
          <AuditLogActionBadge actionCode={auditLog.action_code} />
          <AuditLogTableNameBadge tableName={auditLog.table_name} />
        </div>
      </div>
      <div style={containerStyle}>
        <div style={rowStyle}>
          <span style={labelStyle}>Action</span>
          <span style={valueStyle}>{auditLog.actionCodeLabel}</span>
        </div>
        <div style={rowStyle}>
          <span style={labelStyle}>Entity</span>
          <span style={valueStyle}>{auditLog.tableNameLabel}</span>
        </div>
        {auditLog.record_id && (
          <div style={rowStyle}>
            <span style={labelStyle}>Record ID</span>
            <span style={valueStyle}>{auditLog.recordIdFormatted}</span>
          </div>
        )}
        <div style={rowStyle}>
          <span style={labelStyle}>Timestamp</span>
          <div style={timestampContainerStyle}>
            <span style={valueStyle}>{auditLog.createdAtAbsolute}</span>
            <span style={timestampRelativeStyle}>
              {auditLog.createdAtRelative}
            </span>
          </div>
        </div>
        {auditLog.description && (
          <div style={descriptionRowStyle}>
            <span style={labelStyle}>Description</span>
            <span style={descriptionStyle}>{auditLog.description}</span>
          </div>
        )}
      </div>
    </Card>
  );
});


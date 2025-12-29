// Audit Log Actor Card Component
// Feature-specific component - R16 Layer 2
// Displays actor information (user or SYSTEM)
// Following R17: Secondary attention anchor on detail screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { spacing, typography, colors } from "@/theme/tokens";
import { formatRoleCode } from "@/hooks/useAuditLogTransformations";
import type { TransformedAuditLogDetail } from "@/hooks/useAuditLogTransformations";

interface AuditLogActorCardProps {
  auditLog: TransformedAuditLogDetail;
}

/**
 * Audit Log Actor Card Component
 * Displays actor information (user or SYSTEM)
 * Following R17: Secondary attention anchor on detail screen
 */
export const AuditLogActorCard = React.memo(function AuditLogActorCard({
  auditLog,
}: AuditLogActorCardProps) {
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
      marginBottom: spacing[2],
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

  const systemStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      fontStyle: "italic" as const,
    } as const),
    []
  );

  const isSystem = !auditLog.actor;

  return (
    <Card variant="default" padding="lg">
      <div style={headerStyle}>
        <h3 style={titleStyle}>Actor</h3>
      </div>
      <div style={containerStyle}>
        {isSystem ? (
          <div style={rowStyle}>
            <span style={labelStyle}>Actor</span>
            <span style={systemStyle}>SYSTEM</span>
          </div>
        ) : (
          <>
            <div style={rowStyle}>
              <span style={labelStyle}>Name</span>
              <span style={valueStyle}>{auditLog.actorDisplayNameFormatted}</span>
            </div>
            {auditLog.actor?.role_code && (
              <div style={rowStyle}>
                <span style={labelStyle}>Role</span>
                <Badge variant="default">
                  {formatRoleCode(auditLog.actor.role_code)}
                </Badge>
              </div>
            )}
            {auditLog.actor?.id && (
              <div style={rowStyle}>
                <span style={labelStyle}>User ID</span>
                <span style={{ ...valueStyle, fontSize: typography.fontSize.small, fontFamily: "monospace" }}>
                  {auditLog.actor.id}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
});


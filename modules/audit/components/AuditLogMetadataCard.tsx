// Audit Log Metadata Card Component
// Feature-specific component - R16 Layer 2
// Displays metadata (IP address, user agent)
// Following R17: Tertiary attention anchor on detail screen (collapsible)

"use client";

import React, { useMemo, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAuditLogDetail } from "@/hooks/useAuditLogTransformations";

interface AuditLogMetadataCardProps {
  auditLog: TransformedAuditLogDetail;
}

/**
 * Audit Log Metadata Card Component
 * Displays metadata information (IP address, user agent)
 * Following R17: Tertiary attention anchor on detail screen (collapsible)
 */
export const AuditLogMetadataCard = React.memo(function AuditLogMetadataCard({
  auditLog,
}: AuditLogMetadataCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

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
      alignItems: "center" as const,
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
      wordBreak: "break-word" as const,
    } as const),
    []
  );

  const hasMetadata = auditLog.ip_address || auditLog.user_agent;

  if (!hasMetadata) {
    return null;
  }

  return (
    <Card variant="outlined" padding="lg">
      <div style={headerStyle}>
        <h3 style={titleStyle}>Metadata</h3>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleToggleExpanded}
        >
          {isExpanded ? "▼ Hide" : "▶ Show"}
        </Button>
      </div>
      {isExpanded && (
        <div style={containerStyle}>
          {auditLog.ip_address && (
            <div style={rowStyle}>
              <span style={labelStyle}>IP Address</span>
              <span style={{ ...valueStyle, fontFamily: "monospace" }}>
                {auditLog.ip_address}
              </span>
            </div>
          )}
          {auditLog.user_agent && (
            <div style={{ ...rowStyle, borderBottom: "none" }}>
              <span style={labelStyle}>User Agent</span>
              <span style={{ ...valueStyle, fontSize: typography.fontSize.small }}>
                {auditLog.user_agent}
              </span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
});


// Audit Log Detail Component
// Screen UI component - R16 Layer 3
// Pure UI component for audit log detail screen
// Following R17: Monitoring Screen, read-only

"use client";

import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { AuditLogActionBadge } from "./AuditLogActionBadge";
import { AuditLogSummaryCard } from "./AuditLogSummaryCard";
import { AuditLogActorCard } from "./AuditLogActorCard";
import { AuditLogValueComparison } from "./AuditLogValueComparison";
import { AuditLogMetadataCard } from "./AuditLogMetadataCard";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedAuditLogDetail } from "@/hooks/useAuditLogTransformations";

interface AuditLogDetailProps {
  auditLog: TransformedAuditLogDetail;
  onBack: () => void;
}

/**
 * Audit Log Detail Component
 * Main UI for audit log detail screen
 * Following R17: Primary (action badge), Secondary (cards)
 */
export const AuditLogDetail = React.memo(function AuditLogDetail({
  auditLog,
  onBack,
}: AuditLogDetailProps) {
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backButtonContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // R17: Primary attention anchor - Action badge
  const actionBadgeContainerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginBottom: spacing[6],
      padding: spacing[4],
    } as const),
    []
  );

  const actionBadgeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      padding: `${spacing[3]} ${spacing[6]}`,
    } as const),
    []
  );

  // R17: Secondary - Cards section
  const contentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={backButtonContainerStyle}>
        <Button variant="secondary" onClick={onBack}>
          ← Back to Audit Logs
        </Button>
      </div>

      {/* R17: Primary Attention Anchor - Action Badge */}
      <div style={actionBadgeContainerStyle}>
        <div style={actionBadgeStyle}>
          <AuditLogActionBadge actionCode={auditLog.action_code} />
        </div>
      </div>

      {/* R17: Secondary - Cards Section */}
      <div style={contentStyle}>
        {/* Summary Card */}
        <AuditLogSummaryCard auditLog={auditLog} />

        {/* Actor Card */}
        <AuditLogActorCard auditLog={auditLog} />

        {/* Value Comparison Card - Primary for value changes */}
        {auditLog.has_value_changes && (
          <AuditLogValueComparison auditLog={auditLog} />
        )}

        {/* Metadata Card - Tertiary, collapsible */}
        <AuditLogMetadataCard auditLog={auditLog} />
      </div>
    </div>
  );
});


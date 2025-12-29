// Audit Log Value Comparison Component
// Feature-specific component - R16 Layer 2
// Displays old vs new values comparison
// Following R17: Primary attention anchor on detail screen (value changes)

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors } from "@/theme/tokens";
import { borderRadius } from "@/theme/tokens";
import type { TransformedAuditLogDetail } from "@/hooks/useAuditLogTransformations";

interface AuditLogValueComparisonProps {
  auditLog: TransformedAuditLogDetail;
}

/**
 * Audit Log Value Comparison Component
 * Displays old vs new values side-by-side
 * Following R17: Primary attention anchor on detail screen (value changes)
 */
export const AuditLogValueComparison = React.memo(function AuditLogValueComparison({
  auditLog,
}: AuditLogValueComparisonProps) {
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

  const comparisonContainerStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: spacing[4],
    } as const),
    []
  );

  const columnStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const columnHeaderStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      padding: spacing[2],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
    } as const),
    []
  );

  const fieldRowStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[1],
      padding: spacing[2],
      borderBottom: `1px solid ${colors.borderLight}`,
    } as const),
    []
  );

  const fieldNameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      textTransform: "capitalize" as const,
    } as const),
    []
  );

  const fieldValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: "monospace",
      color: colors.textPrimary,
      wordBreak: "break-word" as const,
      backgroundColor: colors.backgroundSecondary,
      padding: spacing[2],
      borderRadius: borderRadius.md,
    } as const),
    []
  );

  const emptyStateStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      fontStyle: "italic" as const,
      padding: spacing[4],
      textAlign: "center" as const,
    } as const),
    []
  );

  // Get all unique field names from old_values and new_values
  const allFields = useMemo(() => {
    const oldFields = auditLog.old_values ? Object.keys(auditLog.old_values) : [];
    const newFields = auditLog.new_values ? Object.keys(auditLog.new_values) : [];
    const uniqueFields = Array.from(new Set([...oldFields, ...newFields]));
    return uniqueFields.sort();
  }, [auditLog.old_values, auditLog.new_values]);

  // Format value for display
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return "—";
    }
    if (typeof value === "object") {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  if (!auditLog.has_value_changes || allFields.length === 0) {
    return (
      <Card variant="default" padding="lg">
        <div style={headerStyle}>
          <h3 style={titleStyle}>Value Changes</h3>
        </div>
        <div style={containerStyle}>
          <div style={emptyStateStyle}>
            No value changes recorded for this action.
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="default" padding="lg">
      <div style={headerStyle}>
        <h3 style={titleStyle}>Value Changes</h3>
      </div>
      <div style={containerStyle}>
        <div style={comparisonContainerStyle}>
          {/* Old Values Column */}
          <div style={columnStyle}>
            <div style={columnHeaderStyle}>Before</div>
            {allFields.map((fieldName) => {
              const oldValue = auditLog.old_values?.[fieldName];
              return (
                <div key={`old-${fieldName}`} style={fieldRowStyle}>
                  <div style={fieldNameStyle}>{fieldName.replace(/_/g, " ")}</div>
                  <div style={fieldValueStyle}>{formatValue(oldValue)}</div>
                </div>
              );
            })}
          </div>

          {/* New Values Column */}
          <div style={columnStyle}>
            <div style={columnHeaderStyle}>After</div>
            {allFields.map((fieldName) => {
              const newValue = auditLog.new_values?.[fieldName];
              return (
                <div key={`new-${fieldName}`} style={fieldRowStyle}>
                  <div style={fieldNameStyle}>{fieldName.replace(/_/g, " ")}</div>
                  <div style={fieldValueStyle}>{formatValue(newValue)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
});


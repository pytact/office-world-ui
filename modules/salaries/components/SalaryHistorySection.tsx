// Salary History Section Component
// Feature-specific component - R16 Layer 2
// Collapsible section for salary history (TERTIARY visual hierarchy)
// Following R17 UX Intent: Collapsible, less prominent

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedSalaryHistory } from "@/hooks/useSalaryTransformations";

interface SalaryHistorySectionProps {
  history: TransformedSalaryHistory[];
  isLoading?: boolean;
}

export const SalaryHistorySection = React.memo(function SalaryHistorySection({
  history,
  isLoading = false,
}: SalaryHistorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Memoized styles following R12 (Figma alignment)
  const sectionStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      margin: 0,
    } as const),
    []
  );

  const listStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
    } as const),
    []
  );

  const itemStyle = useMemo(
    () => ({
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "8px",
      border: `1px solid ${colors.borderLight}`,
    } as const),
    []
  );

  const itemHeaderStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const amountStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
    } as const),
    []
  );

  const changeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.success,
    } as const),
    []
  );

  const dateStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  if (isLoading) {
    return (
      <div style={sectionStyle}>
        <Card padding="md">
          <p style={dateStyle}>Loading salary history...</p>
        </Card>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div style={sectionStyle}>
        <Card padding="md">
          <EmptyState
            message="No Salary History"
            description="No salary changes have been recorded yet."
          />
        </Card>
      </div>
    );
  }

  return (
    <div style={sectionStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Salary History ({history.length})</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleToggleExpand}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {isExpanded && (
        <Card padding="md">
          <div style={listStyle}>
            {history.map((entry) => (
              <div key={entry.id} style={itemStyle}>
                <div style={itemHeaderStyle}>
                  <div>
                    <div style={amountStyle}>
                      {entry.previousAmountFormatted} → {entry.newAmountFormatted}
                    </div>
                    {entry.changeLabel && (
                      <div style={changeStyle}>{entry.changeLabel}</div>
                    )}
                  </div>
                </div>
                <div style={dateStyle}>
                  Effective from: {entry.effectiveFromFormatted}
                </div>
                <div style={dateStyle}>
                  Changed on: {entry.createdAtFormatted}
                </div>
                {entry.changed_by && (
                  <div style={dateStyle}>
                    Changed by: {entry.changed_by}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
});


// Active Salary Card Component
// Feature-specific component - R16 Layer 2
// Displays active salary information (PRIMARY visual hierarchy)
// Following R17 UX Intent: Attention anchor for overview screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedSalaryDetails } from "@/hooks/useSalaryTransformations";

interface ActiveSalaryCardProps {
  salary: TransformedSalaryDetails;
  onInitiatePayment?: () => void;
  onUpdateSalary?: () => void;
  canInitiatePayment?: boolean;
  canUpdateSalary?: boolean;
  isPaymentLoading?: boolean;
}

export const ActiveSalaryCard = React.memo(function ActiveSalaryCard({
  salary,
  onInitiatePayment,
  onUpdateSalary,
  canInitiatePayment = false,
  canUpdateSalary = false,
  isPaymentLoading = false,
}: ActiveSalaryCardProps) {
  // Memoized styles following R12 (Figma alignment)
  const cardContentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "flex-start" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const amountStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h2,
      margin: 0,
    } as const),
    []
  );

  const detailsStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const detailRowStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
    } as const),
    []
  );

  const actionsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[3],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  return (
    <Card padding="lg" variant="elevated">
      <div style={cardContentStyle}>
        {/* Header with amount and status */}
        <div style={headerStyle}>
          <div style={detailsStyle}>
            <p style={amountStyle}>{salary.amountFormatted}</p>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Period:</span>
              <span>{salary.salaryPeriodLabel}</span>
            </div>
            <div style={detailRowStyle}>
              <span style={labelStyle}>Frequency:</span>
              <span>{salary.paymentFrequencyLabel}</span>
            </div>
          </div>
          <Badge variant={salary.isActive ? "success" : "default"}>
            {salary.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Actions */}
        {(canInitiatePayment || canUpdateSalary) && (
          <div style={actionsStyle}>
            {canInitiatePayment && (
              <Button
                variant="primary"
                size="lg"
                onClick={onInitiatePayment}
                isLoading={isPaymentLoading}
              >
                Initiate Payment
              </Button>
            )}
            {canUpdateSalary && (
              <Button variant="secondary" size="md" onClick={onUpdateSalary}>
                Update Salary
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
});


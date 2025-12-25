// Payment Amount Display Component
// Feature-specific component - R16 Layer 2
// Displays payable amount prominently (PRIMARY visual hierarchy)
// Following R17 UX Intent: Attention anchor for payment screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors } from "@/theme/tokens";

interface PaymentAmountDisplayProps {
  amount: string; // Formatted currency string (e.g., "₹80,000.00")
  currencySymbol: string; // Currency symbol (e.g., "₹")
  paymentPeriod: string; // Payment period label (e.g., "March 2025")
}

export const PaymentAmountDisplay = React.memo(function PaymentAmountDisplay({
  amount,
  currencySymbol,
  paymentPeriod,
}: PaymentAmountDisplayProps) {
  // Memoized styles following R12 (Figma alignment)
  const cardStyle = useMemo(
    () => ({
      backgroundColor: colors.backgroundPrimary,
      border: `2px solid ${colors.borderFocus}`,
    } as const),
    []
  );

  const amountContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center" as const,
      gap: spacing[4],
      padding: spacing[8],
    } as const),
    []
  );

  const amountStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      margin: 0,
    } as const),
    []
  );

  const periodStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
      margin: 0,
    } as const),
    []
  );

  return (
    <Card padding="lg" variant="outlined" style={cardStyle}>
      <div style={amountContainerStyle}>
        <p style={amountStyle}>
          {currencySymbol}
          {amount}
        </p>
        <p style={periodStyle}>{paymentPeriod}</p>
      </div>
    </Card>
  );
});


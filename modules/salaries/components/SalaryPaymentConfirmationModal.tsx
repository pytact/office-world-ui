// Salary Payment Confirmation Modal
// MOD_SALARY_PAYMENT_CONFIRMATION - Feature-specific modal
// Composes Modal primitive following R16

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

interface SalaryPaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  paymentPeriod: string;
  payableAmount: string;
  currencySymbol: string;
  paymentMethod: string;
  isLoading: boolean;
}

export const SalaryPaymentConfirmationModal = React.memo(
  function SalaryPaymentConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    employeeName,
    paymentPeriod,
    payableAmount,
    currencySymbol,
    paymentMethod,
    isLoading,
  }: SalaryPaymentConfirmationModalProps) {
    // Memoized styles following R12 (Figma alignment)
    const messageStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily,
        color: colors.textPrimary,
        marginBottom: spacing[4],
        lineHeight: typography.lineHeight.body,
      } as const),
      []
    );

    const summaryStyle = useMemo(
      () => ({
        padding: spacing[6],
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        marginBottom: spacing[4],
      } as const),
      []
    );

    const summaryItemStyle = useMemo(
      () => ({
        display: "flex",
        justifyContent: "space-between" as const,
        marginBottom: spacing[3],
        fontSize: typography.fontSize.body,
        fontFamily: typography.fontFamily,
      } as const),
      []
    );

    const amountStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.h3,
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.bold,
        color: colors.textPrimary,
        textAlign: "center" as const,
        marginTop: spacing[4],
        marginBottom: spacing[2],
      } as const),
      []
    );

    const labelStyle = useMemo(
      () => ({
        fontWeight: typography.fontWeight.medium,
        color: colors.textMuted,
      } as const),
      []
    );

    const valueStyle = useMemo(
      () => ({
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
      } as const),
      []
    );

    const warningStyle = useMemo(
      () => ({
        padding: spacing[4],
        backgroundColor: colors.warningBg,
        color: colors.warningText,
        borderRadius: borderRadius.md,
        marginBottom: spacing[4],
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
      } as const),
      []
    );

    const buttonContainerStyle = useMemo(
      () => ({
        display: "flex",
        gap: spacing[4],
        justifyContent: "flex-end" as const,
        marginTop: spacing[4],
      } as const),
      []
    );

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Confirm Salary Payment"
      >
        <div>
          <p style={messageStyle}>
            You are about to record a salary payment for{" "}
            <strong>{employeeName}</strong>. This will create an immutable
            payment record.
          </p>

          <Card padding="md">
            <div style={summaryStyle}>
              <div style={summaryItemStyle}>
                <span style={labelStyle}>Payment Period:</span>
                <span style={valueStyle}>{paymentPeriod}</span>
              </div>
              <div style={summaryItemStyle}>
                <span style={labelStyle}>Payment Method:</span>
                <span style={valueStyle}>{paymentMethod}</span>
              </div>
              <div style={amountStyle}>
                {currencySymbol}
                {payableAmount}
              </div>
            </div>
          </Card>

          <div style={warningStyle}>
            <strong>Important:</strong> This payment record is permanent and
            cannot be modified or deleted. A salary slip will be automatically
            generated and emailed to the employee.
          </div>

          <div style={buttonContainerStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={onConfirm}
              isLoading={isLoading}
            >
              Confirm Payment
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


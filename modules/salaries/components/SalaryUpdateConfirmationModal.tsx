// Salary Update Confirmation Modal
// MOD_SALARY_UPDATE_CONFIRMATION - Feature-specific modal
// Composes Modal primitive following R16

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import type { TransformedSalaryDetails } from "@/hooks/useSalaryTransformations";

interface SalaryUpdateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  previousSalary: TransformedSalaryDetails | null;
  newSalary: {
    amount: string;
    currencySymbol: string;
    effectiveFrom: string;
  };
  isLoading: boolean;
}

export const SalaryUpdateConfirmationModal = React.memo(
  function SalaryUpdateConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    previousSalary,
    newSalary,
    isLoading,
  }: SalaryUpdateConfirmationModalProps) {
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

    const comparisonStyle = useMemo(
      () => ({
        display: "flex",
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        padding: spacing[4],
        backgroundColor: colors.backgroundSecondary,
        borderRadius: borderRadius.md,
        marginBottom: spacing[4],
      } as const),
      []
    );

    const amountStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.h4,
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
      } as const),
      []
    );

    const labelStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
        color: colors.textMuted,
        marginBottom: spacing[1],
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
        title="Confirm Salary Update"
      >
        <div>
          <p style={messageStyle}>
            You are about to update the salary configuration. This will create a
            new salary record and automatically close the previous period.
          </p>

          <Card padding="md">
            <div style={comparisonStyle}>
              <div>
                <div style={labelStyle}>Previous Amount</div>
                <div style={amountStyle}>
                  {previousSalary?.amountFormatted || "—"}
                </div>
                <div style={labelStyle}>
                  Period: {previousSalary?.salaryPeriodLabel || "—"}
                </div>
              </div>
              <div style={useMemo(() => ({ fontSize: typography.fontSize.h3 } as const), [])}>→</div>
              <div>
                <div style={labelStyle}>New Amount</div>
                <div style={amountStyle}>
                  {newSalary.currencySymbol}
                  {newSalary.amount}
                </div>
                <div style={labelStyle}>
                  Effective from: {newSalary.effectiveFrom}
                </div>
              </div>
            </div>
          </Card>

          <div style={warningStyle}>
            <strong>Note:</strong> The previous salary period will be
            automatically closed. This action cannot be undone.
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
              Confirm Update
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


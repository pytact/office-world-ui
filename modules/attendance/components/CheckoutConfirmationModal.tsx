// Checkout Confirmation Modal Component
// Feature-specific modal - R16 Layer 2
// Confirms check-out action before finalizing attendance
// Following R17: Decision screen, clear confirmation

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { spacing, typography, colors } from "@/theme/tokens";

interface CheckoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workedTime?: string | null; // Preview of worked time
  isLoading?: boolean;
}

/**
 * Checkout Confirmation Modal
 * Confirms check-out action and finalizes attendance
 * Following R17: Decision screen, primary action obvious
 * Following R14: Memoized for performance
 */
export const CheckoutConfirmationModal = React.memo(function CheckoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  workedTime,
  isLoading = false,
}: CheckoutConfirmationModalProps) {
  // Memoize style objects to prevent re-creation on every render (R15 Issue 3)
  const messageStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.normal,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      textAlign: "center" as const,
    } as const),
    []
  );

  const timePreviewStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      textAlign: "center" as const,
    } as const),
    []
  );

  const actionsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[3],
      justifyContent: "flex-end" as const,
      marginTop: spacing[4],
    } as const),
    []
  );

  const buttonStyle = useMemo(
    () => ({
      minWidth: "100px",
    } as const),
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Check Out">
      <div>
        <p style={messageStyle}>
          Are you sure you want to check out? This will finalize your
          attendance for today.
        </p>
        {workedTime && (
          <div style={timePreviewStyle}>Worked Time: {workedTime}</div>
        )}
        <div style={actionsStyle}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            style={buttonStyle}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            isLoading={isLoading}
            style={buttonStyle}
          >
            Confirm Check Out
          </Button>
        </div>
      </div>
    </Modal>
  );
});


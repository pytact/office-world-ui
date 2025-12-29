// Leave Cancellation Modal Component
// Feature-specific component - R16 Layer 2
// Modal for confirming leave cancellation
// Following R17: Decision Screen (confirm cancellation)

"use client";

import React, { useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface LeaveCancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

/**
 * Leave Cancellation Modal
 * Confirms cancellation intent
 * Following R17: Primary action (confirm cancellation)
 */
export const LeaveCancellationModal = React.memo(function LeaveCancellationModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LeaveCancellationModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const messageStyle = {
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    marginBottom: spacing[6],
    lineHeight: typography.lineHeight.body,
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: spacing[4],
    justifyContent: "flex-end" as const,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cancel Leave Request">
      <div style={messageStyle}>
        Are you sure you want to cancel this leave request? This action cannot be undone.
      </div>
      <div style={buttonGroupStyle}>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={isLoading}
        >
          Keep Leave Request
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Cancel Leave Request
        </Button>
      </div>
    </Modal>
  );
});


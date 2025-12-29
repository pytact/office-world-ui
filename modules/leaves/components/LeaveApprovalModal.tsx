// Leave Approval Modal Component
// Feature-specific component - R16 Layer 2
// Modal for confirming leave approval
// Following R17: Decision Screen (confirm approval)
// NOTE: This modal was missing from the UI spec but is needed for UX consistency

"use client";

import React, { useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface LeaveApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

/**
 * Leave Approval Modal
 * Confirms approval intent
 * Following R17: Primary action (confirm approval)
 * NOTE: This modal was missing from the UI spec but is needed for UX consistency
 */
export const LeaveApprovalModal = React.memo(function LeaveApprovalModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: LeaveApprovalModalProps) {
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
    <Modal isOpen={isOpen} onClose={onClose} title="Approve Leave Request">
      <div style={messageStyle}>
        Are you sure you want to approve this leave request?
      </div>
      <div style={buttonGroupStyle}>
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
          onClick={handleConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          Approve Leave
        </Button>
      </div>
    </Modal>
  );
});


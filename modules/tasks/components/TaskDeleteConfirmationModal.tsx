// Task Delete Confirmation Modal Component
// Feature-specific component - R16 Layer 2
// Confirmation modal for task deletion

"use client";

import React, { useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface TaskDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  taskName: string;
  isLoading?: boolean;
}

/**
 * Task Delete Confirmation Modal
 * Confirms irreversible task deletion
 * Following R17: Clear confirmation flow
 * Following R14: Memoized for performance
 */
export const TaskDeleteConfirmationModal = React.memo(function TaskDeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  taskName,
  isLoading = false,
}: TaskDeleteConfirmationModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  const messageStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const warningStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.errorText,
      marginBottom: spacing[6],
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  const buttonGroupStyle = React.useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[6],
    } as const),
    []
  );

  const deleteButtonStyle = React.useMemo(
    () => ({
      backgroundColor: colors.errorText,
    } as const),
    []
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Task">
      <div>
        <p style={messageStyle}>
          Are you sure you want to delete <strong>"{taskName}"</strong>? This action cannot be undone.
        </p>
        <p style={warningStyle}>
           This will permanently remove the task and all associated data.
        </p>
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
            style={deleteButtonStyle}
          >
            Delete Task
          </Button>
        </div>
      </div>
    </Modal>
  );
});


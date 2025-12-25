// Task Status Change Modal Component
// Feature-specific component - R16 Layer 2
// Confirmation modal for task status changes
// Following R17: MOD_TASK_STATUS_CHANGE modal

"use client";

import React, { useMemo, useCallback } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import { TaskStatus } from "@/utils/types/requests/task";
import { getTaskStatusLabel } from "@/hooks/useTaskTransformations";

interface TaskStatusChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: TaskStatus;
  newStatus: TaskStatus;
  taskName: string;
  isLoading?: boolean;
}

/**
 * Task Status Change Modal
 * Confirms task status lifecycle transition
 * Following R17: MOD_TASK_STATUS_CHANGE - Confirm lifecycle transition
 * Following R14: Memoized for performance
 */
export const TaskStatusChangeModal = React.memo(function TaskStatusChangeModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  newStatus,
  taskName,
  isLoading = false,
}: TaskStatusChangeModalProps) {
  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

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

  const statusChangeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "8px",
      textAlign: "center" as const,
    } as const),
    []
  );

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[6],
    } as const),
    []
  );

  const currentStatusLabel = getTaskStatusLabel(currentStatus);
  const newStatusLabel = getTaskStatusLabel(newStatus);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Task Status">
      <div>
        <p style={messageStyle}>
          Are you sure you want to change the status of <strong>"{taskName}"</strong>?
        </p>
        <div style={statusChangeStyle}>
          {currentStatusLabel} → {newStatusLabel}
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
            Confirm Status Change
          </Button>
        </div>
      </div>
    </Modal>
  );
});


// Employee Deactivate Confirmation Modal
// MOD_EMPLOYEE_DEACTIVATE_CONFIRMATION - Feature-specific component
// Reuses Modal primitive following R16

"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface EmployeeDeactivateConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  isLoading?: boolean;
}

export const EmployeeDeactivateConfirmationModal = React.memo(
  function EmployeeDeactivateConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    employeeName,
    isLoading = false,
  }: EmployeeDeactivateConfirmationModalProps) {
    const messageStyle= {
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      lineHeight: typography.lineHeight.body,
    };

    const buttonContainerStyle= {
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end",
    };

    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Deactivate Employee"
      >
        <div>
          <p style={messageStyle}>
            Are you sure you want to deactivate <strong>{employeeName}</strong>?
            This will block their login access immediately.
          </p>
          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirm} isLoading={isLoading}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


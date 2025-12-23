// Employee Delete Confirmation Modal
// MOD_EMPLOYEE_DELETE_CONFIRMATION - Feature-specific component
// Reuses Modal primitive following R16

"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface EmployeeDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  employeeName: string;
  isLoading?: boolean;
}

export const EmployeeDeleteConfirmationModal = React.memo(
  function EmployeeDeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    employeeName,
    isLoading = false,
  }: EmployeeDeleteConfirmationModalProps) {
    const messageStyle= {
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      lineHeight: typography.lineHeight.body,
    };

    const warningStyle= {
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.warningText,
      marginBottom: spacing[4],
      padding: spacing[3],
      backgroundColor: colors.warningBg,
      borderRadius: "4px",
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
        title="Delete Employee"
      >
        <div>
          <p style={messageStyle}>
            Are you sure you want to soft delete <strong>{employeeName}</strong>?
            This will hide the employee from all lists while preserving historical data.
          </p>
          <div style={warningStyle}>
            <strong>Warning:</strong> After deletion, this employee will not be visible to anyone, including CEO.
          </div>
          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirm} isLoading={isLoading}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


// Company Delete Confirmation Modal
// MOD_COMPANY_DELETE_CONFIRMATION - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

interface CompanyDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isLoading: boolean;
}

export const CompanyDeleteConfirmationModal = React.memo(
  function CompanyDeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    companyName,
    isLoading,
  }: CompanyDeleteConfirmationModalProps) {
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

    const dangerStyle = useMemo(
      () => ({
        padding: spacing[4],
        backgroundColor: colors.errorBg,
        color: colors.errorText,
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
      justifyContent: "flex-end",
      marginTop: spacing[4],
    } as const),
    []
  );

  const deleteButtonStyle = useMemo(
    () => ({
      backgroundColor: colors.errorText,
    } as const),
    []
  );

  return (
      <Modal isOpen={isOpen} onClose={onClose} title="Delete Company">
        <div>
          <p style={messageStyle}>
            Are you sure you want to permanently delete <strong>{companyName}</strong>?
          </p>

          <div style={dangerStyle}>
            <strong>Danger:</strong> This action is irreversible. All company data,
            including users, will be permanently deleted and cannot be recovered.
          </div>

          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              isLoading={isLoading}
              style={deleteButtonStyle}
            >
              Delete Permanently
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


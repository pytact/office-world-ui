// Company Soft Delete Confirmation Modal
// MOD_COMPANY_SOFT_DELETE_CONFIRMATION - Pure UI component following R7

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

interface CompanySoftDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  companyName: string;
  isLoading: boolean;
  action: "soft-delete" | "restore";
}

export const CompanySoftDeleteConfirmationModal = React.memo(
  function CompanySoftDeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    companyName,
    isLoading,
    action,
  }: CompanySoftDeleteConfirmationModalProps) {
    const isRestoring = action === "restore";
    const title = useMemo(
      () => (isRestoring ? "Restore Company" : "Soft Delete Company"),
      [isRestoring]
    );

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

    const warningStyle = useMemo(
      () => ({
        padding: spacing[4],
        backgroundColor: isRestoring ? colors.infoBg : colors.warningBg,
        color: isRestoring ? colors.infoText : colors.warningText,
        borderRadius: borderRadius.md,
        marginBottom: spacing[4],
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
      } as const),
      [isRestoring]
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

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div>
          <p style={messageStyle}>
            Are you sure you want to {isRestoring ? "restore" : "soft delete"}{" "}
            <strong>{companyName}</strong>?
          </p>

          <div style={warningStyle}>
            <strong>{isRestoring ? "Info:" : "Warning:"}</strong>{" "}
            {isRestoring
              ? "Restoring this company will make it visible again and restore access."
              : "Soft deleting this company will mark it as deleted but preserve all data. It can be restored later."}
          </div>

          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              isLoading={isLoading}
              variant={isRestoring ? "primary" : "secondary"}
            >
              {isRestoring ? "Restore" : "Soft Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


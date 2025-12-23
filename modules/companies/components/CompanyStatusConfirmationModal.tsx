// Company Status Confirmation Modal
// MOD_COMPANY_STATUS_CONFIRMATION - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

interface CompanyStatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: "activate" | "deactivate";
  companyName: string;
  isLoading: boolean;
}

export const CompanyStatusConfirmationModal = React.memo(
  function CompanyStatusConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    action,
    companyName,
    isLoading,
  }: CompanyStatusConfirmationModalProps) {
    const isActivating = action === "activate";

    const title = useMemo(
      () => (isActivating ? "Activate Company" : "Deactivate Company"),
      [isActivating]
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
        justifyContent: "flex-end",
        marginTop: spacing[4],
      } as const),
      []
    );

    const deactivateButtonStyle = useMemo(
      () => ({
        backgroundColor: colors.errorText,
      } as const),
      []
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div>
          <p style={messageStyle}>
            Are you sure you want to {isActivating ? "activate" : "deactivate"}{" "}
            <strong>{companyName}</strong>?
          </p>

          {!isActivating && (
            <div style={warningStyle}>
              <strong>Warning:</strong> Deactivating this company will immediately
              block login access for all associated users. This action can be
              reversed by activating the company again.
            </div>
          )}

          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              isLoading={isLoading}
              style={!isActivating ? deactivateButtonStyle : undefined}
            >
              {isActivating ? "Activate" : "Deactivate"}
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


// Project Status Confirmation Modal
// MOD_PROJECT_STATUS_CONFIRMATION - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

type ProjectStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";

interface ProjectStatusConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  currentStatus: ProjectStatus;
  newStatus: ProjectStatus;
  projectName: string;
  isLoading: boolean;
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  COMPLETED: "Completed",
};

/**
 * Project Status Confirmation Modal
 * Confirms project status change with impact warning
 * Following R17: Primary (warning message), Secondary (confirm button)
 */
export const ProjectStatusConfirmationModal = React.memo(
  function ProjectStatusConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    currentStatus,
    newStatus,
    projectName,
    isLoading,
  }: ProjectStatusConfirmationModalProps) {
    const willFreeze = newStatus === "INACTIVE" || newStatus === "COMPLETED";
    const willUnfreeze = currentStatus !== "ACTIVE" && newStatus === "ACTIVE";

    const title = useMemo(
      () => `Change Project Status`,
      []
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
        justifyContent: "flex-end" as const,
        marginTop: spacing[4],
      } as const),
      []
    );

    return (
      <Modal isOpen={isOpen} onClose={onClose} title={title}>
        <div>
          <p style={messageStyle}>
            Are you sure you want to change the status of{" "}
            <strong>{projectName}</strong> from{" "}
            <strong>{STATUS_LABELS[currentStatus]}</strong> to{" "}
            <strong>{STATUS_LABELS[newStatus]}</strong>?
          </p>

          {willFreeze && (
            <div style={warningStyle}>
              <strong>Warning:</strong> Changing the project status to{" "}
              {STATUS_LABELS[newStatus]} will freeze the project and prevent
              task modifications. Tasks in this project cannot be edited while
              the project is {STATUS_LABELS[newStatus].toLowerCase()}.
            </div>
          )}

          {willUnfreeze && (
            <div style={warningStyle}>
              <strong>Note:</strong> Changing the project status to Active will
              unfreeze the project and allow task modifications again.
            </div>
          )}

          <div style={buttonContainerStyle}>
            <Button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="button" onClick={onConfirm} isLoading={isLoading}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    );
  }
);


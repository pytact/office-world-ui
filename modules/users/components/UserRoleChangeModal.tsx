// UserRoleChangeModal Component
// MOD_USER_ROLE_CHANGE - Modal for changing user role
// Following R7, R16: Pure UI component, uses hooks for logic

"use client";

import React, { useMemo } from "react";
import { Modal, Button, Select } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface UserRoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoleCode: string;
  currentRoleName: string;
  selectedRoleCode: string;
  onRoleChange: (roleCode: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
  warningMessage?: string | null;
}

// Memoized options to prevent re-renders (R15)
const roleOptions = [
  { value: "ceo", label: "CEO" },
  { value: "hr", label: "HR" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
];

/**
 * UserRoleChangeModal Component
 * Modal for confirming and applying role change
 * Following MOD_USER_ROLE_CHANGE specification
 */
export const UserRoleChangeModal = React.memo(function UserRoleChangeModal({
  isOpen,
  onClose,
  currentRoleCode,
  currentRoleName,
  selectedRoleCode,
  onRoleChange,
  onSubmit,
  isLoading,
  error,
  warningMessage,
}: UserRoleChangeModalProps) {
  const hasChanged = selectedRoleCode !== currentRoleCode;

  // Memoized style objects to prevent re-renders (R15)
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[4],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: "4px",
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const warningMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: "#fff3cd",
      color: "#856404",
      borderRadius: "4px",
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      border: "1px solid #ffc107",
    } as const),
    []
  );

  const currentRoleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      display: "block",
      marginBottom: spacing[2],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end",
      marginTop: spacing[2],
    } as const),
    []
  );

  const handleRoleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRoleChange(e.target.value);
    },
    [onRoleChange]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change User Role">
      <div style={containerStyle}>
        {error && <div style={errorMessageStyle}>{error}</div>}
        {warningMessage && <div style={warningMessageStyle}>{warningMessage}</div>}

        <div>
          <p style={currentRoleStyle}>
            Current Role: <strong>{currentRoleName}</strong>
          </p>
        </div>

        <div>
          <label style={labelStyle}>New Role</label>
          <Select
            options={roleOptions}
            value={selectedRoleCode}
            onChange={handleRoleChange}
          />
        </div>

        <div style={buttonContainerStyle}>
          <Button type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            isLoading={isLoading}
            disabled={!hasChanged || isLoading}
          >
            Confirm Change
          </Button>
        </div>
      </div>
    </Modal>
  );
});


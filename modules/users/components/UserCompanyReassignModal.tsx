// UserCompanyReassignModal Component
// Modal for reassigning user to different company (SuperAdmin only)
// Following R7, R16: Pure UI component, uses hooks for logic

"use client";

import React, { useMemo } from "react";
import { Modal, Button, Select } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface CompanyOption {
  value: string; // company_id
  label: string; // company name
}

interface UserCompanyReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCompanyName: string | null;
  selectedCompanyId: string;
  onCompanyChange: (companyId: string) => void;
  selectedRoleCode: string;
  onRoleChange: (roleCode: string) => void;
  companyOptions: CompanyOption[];
  roleOptions: Array<{ value: string; label: string }>;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string | null;
}

/**
 * UserCompanyReassignModal Component
 * Modal for reassigning user to different company with optional role change
 * SuperAdmin only
 */
export const UserCompanyReassignModal = React.memo(function UserCompanyReassignModal({
  isOpen,
  onClose,
  currentCompanyName,
  selectedCompanyId,
  onCompanyChange,
  selectedRoleCode,
  onRoleChange,
  companyOptions,
  roleOptions,
  onSubmit,
  isLoading,
  error,
}: UserCompanyReassignModalProps) {
  const hasChanged = selectedCompanyId !== "";

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

  const currentCompanyStyle = useMemo(
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

  const handleCompanyChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onCompanyChange(e.target.value);
    },
    [onCompanyChange]
  );

  const handleRoleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRoleChange(e.target.value);
    },
    [onRoleChange]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reassign User to Company">
      <div style={containerStyle}>
        {error && <div style={errorMessageStyle}>{error}</div>}

        <div>
          <p style={currentCompanyStyle}>
            Current Company: <strong>{currentCompanyName || "None"}</strong>
          </p>
        </div>

        <div>
          <label style={labelStyle}>New Company *</label>
          <Select
            options={[
              { value: "", label: "Select Company" },
              ...companyOptions,
            ]}
            value={selectedCompanyId}
            onChange={handleCompanyChange}
          />
        </div>

        <div>
          <label style={labelStyle}>New Role (Optional)</label>
          <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, marginBottom: spacing[2] }}>
            Leave empty to keep current role
          </p>
          <Select
            options={[
              { value: "", label: "Keep Current Role" },
              ...roleOptions,
            ]}
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
            disabled={!hasChanged || isLoading || !selectedCompanyId}
          >
            Reassign User
          </Button>
        </div>
      </div>
    </Modal>
  );
});


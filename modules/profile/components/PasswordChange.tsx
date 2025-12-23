// Password Change UI Component
// Pure UI component following R7

"use client";

import React, { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { Card, Button, Input, PasswordInput } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface PasswordChangeProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  onCancel: () => void;
  isLoading: boolean;
  error?: string;
}

export const PasswordChange = React.memo(function PasswordChange({
  onSubmit,
  onCancel,
  isLoading,
  error,
}: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
      maxWidth: "600px",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[4],
      display: "inline-block",
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[6],
    } as const),
    []
  );

  const formContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[4],
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
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
      color: colors.textPrimary,
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[4],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: spacing[2],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const infoMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.infoBg,
      color: colors.infoText,
      borderRadius: spacing[2],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};

      if (!currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }
      if (!newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d])/.test(newPassword)
      ) {
        newErrors.newPassword =
          "Password must contain uppercase, lowercase, number, and special character";
      }
      if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (currentPassword === newPassword) {
        newErrors.newPassword = "New password must be different from current password";
      }

      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        onSubmit(currentPassword, newPassword);
      }
    },
    [currentPassword, newPassword, confirmPassword, onSubmit]
  );

  const isValid = useMemo(() => {
    return (
      currentPassword &&
      newPassword &&
      confirmPassword &&
      newPassword === confirmPassword &&
      Object.keys(errors).length === 0
    );
  }, [currentPassword, newPassword, confirmPassword, errors]);

  return (
    <div style={containerStyle}>
      <Link href="/me/profile" style={backLinkStyle}>
        ← Back to Profile
      </Link>

      <h1 style={headingStyle}>Change Password</h1>

      <Card>
        <form onSubmit={handleSubmit} style={formContainerStyle}>
          {error && <div style={errorMessageStyle}>{error}</div>}

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="current_password">
              Current Password
            </label>
            <PasswordInput
              id="current_password"
              name="current_password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              error={!!errors.currentPassword}
              errorMessage={errors.currentPassword}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="new_password">
              New Password
            </label>
            <PasswordInput
              id="new_password"
              name="new_password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={!!errors.newPassword}
              errorMessage={errors.newPassword}
            />
            <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, margin: 0 }}>
              Must be at least 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="confirm_password">
              Confirm New Password
            </label>
            <PasswordInput
              id="confirm_password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
            />
          </div>

          <div style={buttonContainerStyle}>
            <Button type="submit" isLoading={isLoading} disabled={!isValid}>
              Change Password
            </Button>
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});


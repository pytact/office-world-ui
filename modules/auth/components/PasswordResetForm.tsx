// Password Reset Form Component
// Pure UI form component - R16 Layer 2
// Composes form inputs following R10 (React Hook Form)
// Following R17 UX Intent: Creation Screen with clear primary action

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { spacing, typography, colors } from "@/theme/tokens";
import type { PasswordResetSubmitFormSchema } from "@/modules/auth/forms";
import { UseFormReturn } from "react-hook-form";

interface PasswordResetFormProps {
  form: UseFormReturn<PasswordResetSubmitFormSchema>;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Record<string, string>;
  rootError?: string;
}

/**
 * UX Intent Lock (R17 PHASE-UX-0):
 * - Screen Classification: Creation Screen (set new password)
 * - Primary Intent: Set new password using reset token
 * - Primary Action: Submit new password (visually dominant button)
 * - Secondary Actions: None (focused flow)
 * - Attention Anchor: Page title "Set New Password"
 * - Exit Path: Success → redirect to login page
 */
export const PasswordResetForm = React.memo(function PasswordResetForm({
  form,
  isLoading = false,
  onSubmit,
  errors = {},
  rootError,
}: PasswordResetFormProps) {
  const { register, watch, formState } = form;
  const formValues = watch();

  // Merge form state errors with prop errors
  const mergedErrors = useMemo(() => {
    const formErrors = formState.errors;
    return {
      password: formErrors.password?.message || errors.password,
      password_confirm: formErrors.password_confirm?.message || errors.password_confirm,
    };
  }, [formState.errors, errors]);

  // Memoized styles following R12 (Figma alignment) and R13 (design tokens)
  const containerStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: "420px",
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[12],
      textAlign: "left" as const,
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing[3],
      lineHeight: typography.lineHeight.h2,
      margin: `0 0 ${spacing[3]} 0`,
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const subtitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.body,
      margin: 0,
      fontWeight: typography.fontWeight.normal,
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
      marginBottom: spacing[8],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      display: "block",
      marginBottom: spacing[2],
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const helperTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      margin: 0,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      padding: `${spacing[4]} ${spacing[5]}`,
      borderRadius: "8px",
      marginBottom: spacing[8],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const actionsStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
      marginTop: spacing[2],
    } as const),
    []
  );

  return (
    <Card padding="lg" variant="elevated">
      <form onSubmit={onSubmit} style={containerStyle}>
        {/* PRIMARY: Header (Attention Anchor) */}
        <div style={headerStyle}>
          <h1 style={headingStyle}>Set New Password</h1>
          <p style={subtitleStyle}>
            Enter your new password below. Make sure it's strong and secure.
          </p>
        </div>

        {/* SECONDARY: Error Display */}
        {rootError && <div style={errorMessageStyle}>{rootError}</div>}

        {/* PRIMARY: Password Input */}
        <div style={fieldGroupStyle}>
          <label htmlFor="password" style={labelStyle}>
            New Password
          </label>
          <PasswordInput
            id="password"
            {...register("password")}
            placeholder="Enter new password"
            error={!!mergedErrors.password}
            errorMessage={mergedErrors.password}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
          <p style={helperTextStyle}>
            Must be at least 8 characters with uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* PRIMARY: Confirm Password Input */}
        <div style={fieldGroupStyle}>
          <label htmlFor="password_confirm" style={labelStyle}>
            Confirm New Password
          </label>
          <PasswordInput
            id="password_confirm"
            {...register("password_confirm")}
            placeholder="Confirm new password"
            error={!!mergedErrors.password_confirm}
            errorMessage={mergedErrors.password_confirm}
            disabled={isLoading}
            autoComplete="new-password"
            required
          />
        </div>

        {/* PRIMARY: Submit Button (Primary Action) */}
        <div style={actionsStyle}>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            disabled={isLoading}
            style={{ width: "100%" }}
          >
            Reset Password
          </Button>
        </div>
      </form>
    </Card>
  );
});


// User Activation Form Component
// Pure UI form component - R16 Layer 2
// Composes form inputs following R10 (React Hook Form)
// Following R17 UX Intent: Creation Screen with clear primary action

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { spacing, typography, colors } from "@/theme/tokens";
import type { ActivationFormSchema } from "@/modules/auth/forms";
import { UseFormReturn } from "react-hook-form";

interface ActivationFormProps {
  form: UseFormReturn<ActivationFormSchema>;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Record<string, string>;
  rootError?: string;
  email?: string;
  companyName?: string;
}

/**
 * UX Intent Lock (R17 PHASE-UX-0):
 * - Screen Classification: Creation Screen (activate account)
 * - Primary Intent: Activate account with name and password
 * - Primary Action: Submit activation (visually dominant button)
 * - Secondary Actions: None (focused flow)
 * - Attention Anchor: Page title "Activate Your Account"
 * - Exit Path: Success → redirect to login page
 */
export const ActivationForm = React.memo(function ActivationForm({
  form,
  isLoading = false,
  onSubmit,
  errors = {},
  rootError,
  email,
  companyName,
}: ActivationFormProps) {
  const { register, watch, formState } = form;
  const formValues = watch();

  // Merge form state errors with prop errors
  const mergedErrors = useMemo(() => {
    const formErrors = formState.errors;
    return {
      first_name: formErrors.first_name?.message || errors.first_name,
      last_name: formErrors.last_name?.message || errors.last_name,
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

  const infoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.body,
      margin: `0 0 ${spacing[6]} 0`,
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
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: spacing[1],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: `${spacing[4]} ${spacing[5]}`,
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: "8px",
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[8],
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const buttonStyle = useMemo(
    () => ({
      width: "100%",
      marginTop: spacing[4],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <Card padding="lg" variant="elevated">
        <div style={headerStyle}>
          <h1 style={headingStyle}>Activate Your Account</h1>
          {email && (
            <p style={subtitleStyle}>
              Welcome! Please complete your account setup for <strong>{email}</strong>
            </p>
          )}
          {companyName && (
            <p style={infoStyle}>
              Company: <strong>{companyName}</strong>
            </p>
          )}
        </div>

        <form onSubmit={onSubmit}>
          {/* Root Error Message */}
          {rootError && <div style={errorMessageStyle}>{rootError}</div>}

          {/* First Name */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="first_name">
              First Name <span style={{ color: colors.errorText }}>*</span>
            </label>
            <Input
              id="first_name"
              type="text"
              {...register("first_name")}
              placeholder="Enter your first name"
              error={!!mergedErrors.first_name}
              errorMessage={mergedErrors.first_name}
              autoComplete="given-name"
            />
          </div>

          {/* Last Name */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="last_name">
              Last Name <span style={{ color: colors.errorText }}>*</span>
            </label>
            <Input
              id="last_name"
              type="text"
              {...register("last_name")}
              placeholder="Enter your last name"
              error={!!mergedErrors.last_name}
              errorMessage={mergedErrors.last_name}
              autoComplete="family-name"
            />
          </div>

          {/* Password */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="password">
              Password <span style={{ color: colors.errorText }}>*</span>
            </label>
            <PasswordInput
              id="password"
              {...register("password")}
              placeholder="Enter your password"
              error={!!mergedErrors.password}
              errorMessage={mergedErrors.password}
              autoComplete="new-password"
            />
            <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, marginTop: spacing[2] }}>
              Must contain uppercase, lowercase, number, and special character
            </p>
          </div>

          {/* Confirm Password */}
          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="password_confirm">
              Confirm Password <span style={{ color: colors.errorText }}>*</span>
            </label>
            <PasswordInput
              id="password_confirm"
              {...register("password_confirm")}
              placeholder="Confirm your password"
              error={!!mergedErrors.password_confirm}
              errorMessage={mergedErrors.password_confirm}
              autoComplete="new-password"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            size="lg"
            style={buttonStyle}
          >
            Activate Account
          </Button>
        </form>
      </Card>
    </div>
  );
});


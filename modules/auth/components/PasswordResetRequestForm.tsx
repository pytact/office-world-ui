// Password Reset Request Form Component
// Pure UI form component - R16 Layer 2
// Composes form inputs following R10 (React Hook Form)
// Following R17 UX Intent: Creation Screen with clear primary action

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { spacing, typography, colors } from "@/theme/tokens";
import type { PasswordResetRequestFormSchema } from "@/modules/auth/forms";
import { UseFormReturn } from "react-hook-form";

interface PasswordResetRequestFormProps {
  form: UseFormReturn<PasswordResetRequestFormSchema>;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
  errors?: Record<string, string>;
  rootError?: string;
  successMessage?: string;
}

/**
 * UX Intent Lock (R17 PHASE-UX-0):
 * - Screen Classification: Creation Screen (input email to request reset)
 * - Primary Intent: Request password reset email
 * - Primary Action: Submit email (visually dominant button)
 * - Secondary Actions: Back to login (visually reduced)
 * - Attention Anchor: Page title "Reset Password"
 * - Exit Path: Success message → user checks email → navigate to login
 */
export const PasswordResetRequestForm = React.memo(
  function PasswordResetRequestForm({
    form,
    isLoading = false,
    onSubmit,
    onBack,
    errors = {},
    rootError,
    successMessage,
  }: PasswordResetRequestFormProps) {
    const { register, watch, formState } = form;
    const formValues = watch();

    // Merge form state errors with prop errors
    const mergedErrors = useMemo(() => {
      const formErrors = formState.errors;
      return {
        email: formErrors.email?.message || errors.email,
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

    const successMessageStyle = useMemo(
      () => ({
        backgroundColor: colors.successBg || "#D1FAE5",
        color: colors.successText || "#065F46",
        padding: `${spacing[4]} ${spacing[5]}`,
        borderRadius: "8px",
        marginBottom: spacing[8],
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
        lineHeight: typography.lineHeight.body,
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

    // PRIMARY: Success message (if reset email sent)
    if (successMessage) {
      return (
        <Card padding="lg" variant="elevated">
          <div style={containerStyle}>
            <div style={headerStyle}>
              <h1 style={headingStyle}>Check Your Email</h1>
              <p style={subtitleStyle}>
                We've sent password reset instructions to your email address.
              </p>
            </div>
            <div style={successMessageStyle}>{successMessage}</div>
            {onBack && (
              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={onBack}
                style={{ width: "100%" }}
              >
                Back to Login
              </Button>
            )}
          </div>
        </Card>
      );
    }

    return (
      <Card padding="lg" variant="elevated">
        <form onSubmit={onSubmit} style={containerStyle}>
          {/* PRIMARY: Header (Attention Anchor) */}
          <div style={headerStyle}>
            <h1 style={headingStyle}>Reset Password</h1>
            <p style={subtitleStyle}>
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          {/* SECONDARY: Error Display */}
          {rootError && <div style={errorMessageStyle}>{rootError}</div>}

          {/* PRIMARY: Email Input */}
          <div style={fieldGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="you@example.com"
              error={!!mergedErrors.email}
              errorMessage={mergedErrors.email}
              disabled={isLoading}
              autoComplete="email"
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
              Send Reset Instructions
            </Button>
            {/* TERTIARY: Back Link (Secondary Action) */}
            {onBack && (
              <Button
                type="button"
                variant="secondary"
                onClick={onBack}
                disabled={isLoading}
                style={{ width: "100%" }}
              >
                Back to Login
              </Button>
            )}
          </div>
        </form>
      </Card>
    );
  }
);


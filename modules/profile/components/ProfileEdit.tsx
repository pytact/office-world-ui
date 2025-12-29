// Profile Edit UI Component
// Pure UI component following R7

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { Card, Button, Input } from "@/components/ui";
import { UserUpdateFormSchema } from "@/modules/users/forms/user.schema";
import { spacing, typography, colors } from "@/theme/tokens";

interface ProfileEditProps {
  email: string;
  form: UseFormReturn<UserUpdateFormSchema>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProfileEdit = React.memo(function ProfileEdit({
  email,
  form,
  onSubmit,
  onCancel,
  isLoading,
}: ProfileEditProps) {
  const {
    register,
    formState: { errors, isValid, isDirty, defaultValues },
    watch,
  } = form;

  // Watch form values to check if they've changed
  const firstName = watch("first_name");
  const lastName = watch("last_name");

  // Check if form has been modified and values are different from defaults
  // Button should be enabled only if user has typed something different from initial values
  const hasChanges = useMemo(() => {
    if (!isDirty) return false;
    
    // Compare current values with default values
    const currentFirstName = firstName ?? null;
    const currentLastName = lastName ?? null;
    const defaultFirstName = defaultValues?.first_name ?? null;
    const defaultLastName = defaultValues?.last_name ?? null;

    // Check if any field has actually changed
    const firstNameChanged = currentFirstName !== defaultFirstName;
    const lastNameChanged = currentLastName !== defaultLastName;

    return firstNameChanged || lastNameChanged;
  }, [isDirty, firstName, lastName, defaultValues]);

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

  const readOnlyFieldStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      border: `1px solid ${colors.borderDefault}`,
      borderRadius: spacing[2],
      color: colors.textMuted,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
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

  return (
    <div style={containerStyle}>
      <Link href={typeof window !== "undefined" && window.location.pathname.startsWith("/company") ? "/company/dashboard" : "/platform/dashboard"} style={backLinkStyle}>
        ← Back to Dashboard
      </Link>

      <h1 style={headingStyle}>Edit Profile</h1>

      <Card>
        <form onSubmit={onSubmit} style={formContainerStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email</label>
            <div style={readOnlyFieldStyle}>{email}</div>
            <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, margin: 0 }}>
              Email cannot be changed
            </p>
          </div>

          {errors.root && (
            <div style={errorMessageStyle}>{errors.root.message}</div>
          )}

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="first_name">
              First Name
            </label>
            <Input
              id="first_name"
              type="text"
              placeholder="Enter first name"
              {...register("first_name")}
              error={!!errors.first_name}
              errorMessage={errors.first_name?.message}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle} htmlFor="last_name">
              Last Name
            </label>
            <Input
              id="last_name"
              type="text"
              placeholder="Enter last name"
              {...register("last_name")}
              error={!!errors.last_name}
              errorMessage={errors.last_name?.message}
            />
          </div>

          <div style={buttonContainerStyle}>
            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={!hasChanges || !isValid}
            >
              Update Profile
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


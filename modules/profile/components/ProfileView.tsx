// Profile View UI Component
// Pure UI component following R7 and R16
// Following R17: UX Perception & Intent Governance applied


"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { Card, Button, Input, Badge } from "@/components/ui";
import { UserUpdateFormSchema } from "@/modules/users/forms/user.schema";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";

interface ProfileViewProps {
  email: string;
  role: string;
  form: UseFormReturn<UserUpdateFormSchema>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const ProfileView = React.memo(function ProfileView({
  email,
  role,
  form,
  onSubmit,
  onCancel,
  isLoading,
}: ProfileViewProps) {
  const router = useRouter();

  const {
    register,
    formState: { errors, isValid },
  } = form;

  // PHASE-UX-1: Visual Dominance - Container with clear hierarchy
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
      backgroundColor: colors.backgroundSecondary,
      minHeight: "100vh",
    } as const),
    []
  );

  // PHASE-UX-1: Primary - Page title
  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[8],
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  // PHASE-UX-1: Secondary - Section cards
  const sectionCardStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
      borderRadius: borderRadius.lg,
      boxShadow: shadows.md,
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      paddingBottom: spacing[4],
      borderBottom: `2px solid ${colors.borderLight}`,
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
      marginBottom: spacing[4],
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
      borderRadius: borderRadius.md,
      color: colors.textMuted,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const badgeStyle = useMemo(
    () => ({
      display: "inline-block",
      marginTop: spacing[2],
    } as const),
    []
  );

  const changePasswordButtonStyle = useMemo(
    () => ({
      marginTop: spacing[4],
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[6],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[4],
    } as const),
    []
  );


  const handleChangePassword = () => {
    router.push("/me/password");
  };

  return (
    <div style={containerStyle}>
      {/* PHASE-UX-1: Primary - Page title */}
      <h1 style={headingStyle}>My Profile</h1>

      {/* PHASE-UX-1: Secondary - Profile Information Section */}
      <div style={sectionCardStyle}>
        <Card>
          <h2 style={sectionTitleStyle}>Profile Information</h2>
        <form onSubmit={onSubmit}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Email</label>
            <div style={readOnlyFieldStyle}>{email}</div>
            <p
              style={{
                fontSize: typography.fontSize.small,
                color: colors.textMuted,
                margin: 0,
                marginTop: spacing[1],
              }}
            >
              Email cannot be changed
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Role</label>
            <div style={readOnlyFieldStyle}>
              <div style={badgeStyle}>
                <Badge variant="default">
                  {role}
                </Badge>
              </div>
            </div>
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
            <Button type="submit" isLoading={isLoading} disabled={!isValid}>
              Update Profile
            </Button>
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancel
            </Button>
          </div>
          <div style={changePasswordButtonStyle}>
            <Button
              type="button"
              onClick={handleChangePassword}
              variant="secondary"
              size="sm"
            >
              Change Password
            </Button>
          </div>
        </form>
        </Card>
      </div>
    </div>
  );
});


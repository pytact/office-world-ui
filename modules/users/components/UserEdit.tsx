// UserEdit UI Component
// User Edit Page - Pure UI component following R7 and R10

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";
import { Card, Button, Input } from "@/components/ui";
import { UserUpdateFormSchema } from "@/modules/users/forms/user.schema";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { MappedUser } from "@/hooks/useMappedUser";

interface UserEditProps {
  user: MappedUser;
  form: UseFormReturn<UserUpdateFormSchema>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const UserEdit = React.memo(function UserEdit({
  user,
  form,
  onSubmit,
  onCancel,
  isLoading,
}: UserEditProps) {
  const {
    register,
    formState: { errors, isValid },
  } = form;

  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "600px",
      margin: "0 auto",
    } as const),
    []
  );

  const backLinkContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[8],
    } as const),
    []
  );

  const formContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[6],
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      marginBottom: spacing[5],
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

  const labelMutedStyle = useMemo(
    () => ({
      ...labelStyle,
      color: colors.textMuted,
    } as const),
    [labelStyle]
  );

  const disabledInputStyle = useMemo(
    () => ({
      backgroundColor: colors.backgroundSecondary,
      color: colors.textMuted,
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[8],
      paddingTop: spacing[6],
      borderTop: `1px solid ${colors.borderLight}`,
      justifyContent: "flex-end",
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={backLinkContainerStyle}>
        <Link href={userRoutes.shared.detail(user.userId)} style={backLinkStyle}>
          ← Back to User Details
        </Link>
      </div>

      <h1 style={headingStyle}>Edit User</h1>

      <Card padding="lg">
        <form onSubmit={onSubmit}>
          <div style={formContainerStyle}>
            {/* Root Error Message */}
            {errors.root && (
              <div style={errorMessageStyle}>{errors.root.message}</div>
            )}

            {/* Email (read-only) */}
            <div style={fieldGroupStyle}>
              <label style={labelMutedStyle}>Email (cannot be changed)</label>
              <Input
                type="email"
                value={user.email}
                disabled
                style={disabledInputStyle}
              />
            </div>

            {/* First Name Field */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>First Name</label>
              <Input
                type="text"
                placeholder="Enter first name"
                {...register("first_name")}
                error={!!errors.first_name}
                errorMessage={errors.first_name?.message}
                defaultValue={user.firstName || ""}
              />
            </div>

            {/* Last Name Field */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Last Name</label>
              <Input
                type="text"
                placeholder="Enter last name"
                {...register("last_name")}
                error={!!errors.last_name}
                errorMessage={errors.last_name?.message}
                defaultValue={user.lastName || ""}
              />
            </div>

            {/* Submit Buttons */}
            <div style={buttonContainerStyle}>
              <Button type="submit" isLoading={isLoading} disabled={!isValid || isLoading}>
                Save Changes
              </Button>
              <Button type="button" onClick={onCancel} disabled={isLoading}>
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
});


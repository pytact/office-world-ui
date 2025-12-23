// UserInvite UI Component
// SCR_USER_INVITE - Pure UI component following R7 and R10

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { UseFormReturn, Controller } from "react-hook-form";
import { Card, Button, Input, Select } from "@/components/ui";
import { UserInviteFormSchema } from "@/modules/users/forms/user.schema";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";

interface UserInviteProps {
  form: UseFormReturn<UserInviteFormSchema>;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  isSuperAdmin: boolean;
  roleOptions: Array<{ value: string; label: string }>;
  companyOptions: Array<{ value: string; label: string }>;
}

export const UserInvite = React.memo(function UserInvite({
  form,
  onSubmit,
  isLoading,
  isSuperAdmin,
  roleOptions,
  companyOptions,
}: UserInviteProps) {
  const {
    register,
    formState: { errors, isValid, touchedFields },
    watch,
    control,
    trigger,
  } = form;

  const email = watch("email");
  const roleCode = watch("role_code");
  const companySlug = watch("company_slug");

  // Only show errors for fields that have been touched (blurred)
  const shouldShowEmailError = touchedFields.email && errors.email;
  const shouldShowRoleError = touchedFields.role_code && errors.role_code;

  // Manual validation check for button state
  // This ensures button enables when fields are filled, even if form hasn't been fully validated
  const isFormValid = useMemo(() => {
    // Check if email is non-empty and has basic email structure (not too strict while typing)
    const emailValid = email && 
      email.trim().length > 0 && 
      email.includes("@") && 
      email.includes(".") &&
      email.trim().length >= 5; // Minimum reasonable email length
    
    // Check if role is selected (not empty string)
    // Include superadmin role for SuperAdmin users
    const validRoles = ["ceo", "hr", "manager", "employee", "superadmin"];
    const roleValid = roleCode && 
      roleCode.trim().length > 0 && 
      roleCode !== "" &&
      validRoles.includes(roleCode);
    
    return emailValid && roleValid;
  }, [email, roleCode]);

  // Memoized style objects - Modern, clean, spacious design
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "600px",
      margin: "0 auto",
      backgroundColor: colors.backgroundSecondary,
      minHeight: "100vh",
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
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[10],
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const formContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[8],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: `${spacing[4]} ${spacing[5]}`,
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      lineHeight: typography.lineHeight.body,
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
      marginTop: spacing[8],
      paddingTop: spacing[8],
      justifyContent: "flex-end",
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[3],
      marginBottom: spacing[6],
    } as const),
    []
  );

  // Memoized handlers
  const backRoute = useMemo(
    () => (isSuperAdmin ? userRoutes.platform.list : userRoutes.company.list),
    [isSuperAdmin]
  );


  return (
    <div style={containerStyle}>
      <div style={backLinkContainerStyle}>
        <Link href={backRoute} style={backLinkStyle}>
          ← Back to Users
        </Link>
              </div>

      <h1 style={headingStyle}>Invite User</h1>

      <Card variant="elevated" padding="lg">
        <form onSubmit={(e) => {
          console.log("[UserInvite] Form onSubmit called", { e, onSubmit, eventType: e.type });
          // form.handleSubmit already handles preventDefault, so just call it
          onSubmit(e);
        }}>
          <div style={formContainerStyle}>
            {/* Root Error Message */}
            {errors.root && (
              <div style={errorMessageStyle}>{errors.root.message}</div>
            )}

            {/* Email Field */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Email Address <span style={{ color: colors.errorText }}>*</span>
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  onBlur: () => {
                    // Trigger validation on blur
                    trigger("email");
                  },
                })}
                error={!!shouldShowEmailError}
                errorMessage={shouldShowEmailError ? errors.email?.message : undefined}
                aria-label="User email address"
                aria-required="true"
              />
            </div>

            {/* Role Field */}
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>
                Role <span style={{ color: colors.errorText }}>*</span>
              </label>
              <Controller
                name="role_code"
                control={control}
                render={({ field }) => (
                  <Select
                    options={roleOptions}
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // Trigger validation when role is selected
                      if (e.target.value) {
                        trigger("role_code");
                      }
                    }}
                    onBlur={field.onBlur}
                    error={!!shouldShowRoleError}
                    errorMessage={shouldShowRoleError ? errors.role_code?.message : undefined}
                    aria-label="User role"
                    aria-required="true"
                  />
                )}
              />
            </div>

            {/* Company Field (SuperAdmin only) */}
            {isSuperAdmin && companyOptions.length > 0 && (
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Company (Optional)</label>
                <Controller
                  name="company_slug"
                  control={control}
                  render={({ field }) => (
                    <Select
                      options={[
                        { value: "", label: "Select Company (Optional)" },
                        ...companyOptions,
                      ]}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : value);
                      }}
                      error={!!errors.company_slug}
                      errorMessage={errors.company_slug?.message}
                    />
                  )}
                />
              </div>
            )}

            {/* Submit Buttons */}
            <div style={buttonContainerStyle}>
              <Link href={backRoute}>
                <Button type="button" variant="secondary">Cancel</Button>
              </Link>
              <Button 
                type="submit" 
                isLoading={isLoading} 
                disabled={isLoading}
                size="lg"
                onClick={(e) => {
                  console.log("[UserInvite] Button clicked", { 
                    isLoading, 
                    disabled: isLoading,
                    formValid: form.formState.isValid,
                    errors: form.formState.errors,
                    values: form.getValues()
                  });
                  // Don't prevent default - let form handle it
                }}
              >
                Send Invitation
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
});

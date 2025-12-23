// Company Profile UI Component
// SCR_COMPANY_PROFILE - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import { userRoutes, companyRoutes } from "@/utils/routes";
import type { CompanyProfileResponse } from "@/utils/types/responses/company";
import type { useCompanyProfileForm } from "@/hooks/useCompanyProfileForm";

interface CompanyProfileProps {
  profile: CompanyProfileResponse;
  form: ReturnType<typeof useCompanyProfileForm>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
  userCount?: number;
}

export const CompanyProfile = React.memo(function CompanyProfile({
  profile,
  form,
  onSubmit,
  onCancel,
  isLoading,
  errors,
  userCount,
}: CompanyProfileProps) {
  // Memoized style objects to prevent re-renders (R15)
  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
      maxWidth: "800px",
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

  const sectionStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      marginBottom: spacing[4],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
    } as const),
    []
  );

  const readOnlyFieldStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
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

  const warningStyle = useMemo(
    () => ({
      padding: spacing[4],
      backgroundColor: colors.warningBg,
      color: colors.warningText,
      borderRadius: borderRadius.md,
      marginBottom: spacing[4],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const helperTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      margin: 0,
    } as const),
    []
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setDescription(e.target.value);
    },
    [form]
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setAddress(e.target.value);
    },
    [form]
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setCity(e.target.value);
    },
    [form]
  );

  const handleStateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setState(e.target.value);
    },
    [form]
  );

  const handleCountryChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setCountry(e.target.value);
    },
    [form]
  );

  const handlePostalCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setPostalCode(e.target.value);
    },
    [form]
  );

  const handleWebsiteChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setWebsite(e.target.value);
    },
    [form]
  );

  const handleLogoUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setLogoUrl(e.target.value);
    },
    [form]
  );

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Company Profile</h1>

      {!form.isEditable && (
        <div style={warningStyle}>
          Company is inactive. Profile editing is disabled.
        </div>
      )}

      <Card>
        <form onSubmit={onSubmit}>
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Company Information</h2>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Company Name</label>
              <div style={readOnlyFieldStyle}>{profile.name}</div>
              <p style={helperTextStyle}>
                Company name cannot be changed
              </p>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Company Slug</label>
              <div style={readOnlyFieldStyle}>{profile.slug}</div>
              <p style={helperTextStyle}>
                Company slug cannot be changed
              </p>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Status</label>
              <Badge variant={profile.is_active ? "success" : "error"}>
                {profile.is_active ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Description</label>
              <Input
                type="text"
                placeholder="Enter company description"
                value={form.description}
                onChange={handleDescriptionChange}
                disabled={!form.isEditable}
                error={!!errors.description}
                errorMessage={errors.description}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Address Information</h2>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Address</label>
              <Input
                type="text"
                placeholder="Enter company address"
                value={form.address}
                onChange={handleAddressChange}
                disabled={!form.isEditable}
                error={!!errors.address}
                errorMessage={errors.address}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>City</label>
              <Input
                type="text"
                placeholder="Enter city"
                value={form.city}
                onChange={handleCityChange}
                disabled={!form.isEditable}
                error={!!errors.city}
                errorMessage={errors.city}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>State</label>
              <Input
                type="text"
                placeholder="Enter state"
                value={form.state}
                onChange={handleStateChange}
                disabled={!form.isEditable}
                error={!!errors.state}
                errorMessage={errors.state}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Country</label>
              <Input
                type="text"
                placeholder="Enter country"
                value={form.country}
                onChange={handleCountryChange}
                disabled={!form.isEditable}
                error={!!errors.country}
                errorMessage={errors.country}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Postal Code</label>
              <Input
                type="text"
                placeholder="Enter postal code"
                value={form.postalCode}
                onChange={handlePostalCodeChange}
                disabled={!form.isEditable}
                error={!!errors.postalCode}
                errorMessage={errors.postalCode}
              />
            </div>
          </div>

          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>Additional Information</h2>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Website</label>
              <Input
                type="url"
                placeholder="https://example.com"
                value={form.website}
                onChange={handleWebsiteChange}
                disabled={!form.isEditable}
                error={!!errors.website}
                errorMessage={errors.website}
              />
            </div>

            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Logo URL</label>
              <Input
                type="url"
                placeholder="https://example.com/logo.png"
                value={form.logoUrl}
                onChange={handleLogoUrlChange}
                disabled={!form.isEditable}
                error={!!errors.logoUrl}
                errorMessage={errors.logoUrl}
              />
            </div>
          </div>

          {userCount !== undefined && (
            <div style={sectionStyle}>
              <h2 style={sectionTitleStyle}>Company Analytics</h2>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Total Users</label>
                <div style={readOnlyFieldStyle}>
                  <Link
                    href={userRoutes.company.list}
                    style={{
                      color: colors.primary,
                      textDecoration: "none",
                    }}
                  >
                    {userCount} Users
                  </Link>
                </div>
              </div>

              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Company Status</label>
                <Badge variant={profile.is_active ? "success" : "error"}>
                  {profile.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          )}

          <div style={buttonContainerStyle}>
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!form.isEditable || !form.hasChanges || !form.isValid}
            >
              Save Changes
            </Button>
            <Button
              type="button"
              onClick={() => window.location.href = companyRoutes.settings.view}
              variant="secondary"
            >
              Settings
            </Button>
            <Button type="button" onClick={onCancel} disabled={!form.hasChanges}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});


// Company Edit UI Component
// SCR_COMPANY_EDIT_PLATFORM - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { companyRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useCompanyProfileForm } from "@/hooks/useCompanyProfileForm";

interface CompanyEditProps {
  companyName: string;
  companyId: string;
  form: ReturnType<typeof useCompanyProfileForm>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isLoading: boolean;
  errors: Record<string, string>;
}

export const CompanyEdit = React.memo(function CompanyEdit({
  companyName,
  companyId,
  form,
  onSubmit,
  onCancel,
  isLoading,
  errors,
}: CompanyEditProps) {
  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[6],
      display: "inline-block",
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
      marginTop: spacing[8],
      paddingTop: spacing[6],
      borderTop: `1px solid ${colors.borderLight}`,
      justifyContent: "flex-end",
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
      <Link href={companyRoutes.platform.detail(companyId)} style={backLinkStyle}>
        ← Back to Company Details
      </Link>

      <h1 style={headingStyle}>Edit Company: {companyName}</h1>

      <Card padding="lg">
        <form onSubmit={onSubmit} style={formContainerStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Company Name</label>
            <div style={readOnlyFieldStyle}>{companyName}</div>
            <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, margin: 0 }}>
              Company name cannot be changed
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Company Slug</label>
            <div style={readOnlyFieldStyle}>{companyId}</div>
            <p style={{ fontSize: typography.fontSize.small, color: colors.textMuted, margin: 0 }}>
              Company slug cannot be changed
            </p>
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Description</label>
            <Input
              type="text"
              placeholder="Enter company description (optional)"
              value={form.description}
              onChange={handleDescriptionChange}
              error={!!errors.description}
              errorMessage={errors.description}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Address</label>
            <Input
              type="text"
              placeholder="Enter company address (optional)"
              value={form.address}
              onChange={handleAddressChange}
              error={!!errors.address}
              errorMessage={errors.address}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>City</label>
            <Input
              type="text"
              placeholder="Enter city (optional)"
              value={form.city}
              onChange={handleCityChange}
              error={!!errors.city}
              errorMessage={errors.city}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>State</label>
            <Input
              type="text"
              placeholder="Enter state (optional)"
              value={form.state}
              onChange={handleStateChange}
              error={!!errors.state}
              errorMessage={errors.state}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Country</label>
            <Input
              type="text"
              placeholder="Enter country (optional)"
              value={form.country}
              onChange={handleCountryChange}
              error={!!errors.country}
              errorMessage={errors.country}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Postal Code</label>
            <Input
              type="text"
              placeholder="Enter postal code (optional)"
              value={form.postalCode}
              onChange={handlePostalCodeChange}
              error={!!errors.postalCode}
              errorMessage={errors.postalCode}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Website</label>
            <Input
              type="url"
              placeholder="https://example.com (optional)"
              value={form.website}
              onChange={handleWebsiteChange}
              error={!!errors.website}
              errorMessage={errors.website}
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>Logo URL</label>
            <Input
              type="url"
              placeholder="https://example.com/logo.png (optional)"
              value={form.logoUrl}
              onChange={handleLogoUrlChange}
              error={!!errors.logoUrl}
              errorMessage={errors.logoUrl}
            />
          </div>

          <div style={buttonContainerStyle}>
            <Button type="submit" isLoading={isLoading} disabled={!form.isValid}>
              Update Company
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


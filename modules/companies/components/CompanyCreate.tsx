// Company Create UI Component
// SCR_COMPANY_CREATE - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { companyRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useCompanyForm } from "@/hooks/useCompanyForm";

interface CompanyCreateProps {
  form: ReturnType<typeof useCompanyForm>;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onSlugGenerate: (name: string) => void;
  isLoading: boolean;
  errors: Record<string, string>;
}

export const CompanyCreate = React.memo(function CompanyCreate({
  form,
  onSubmit,
  onCancel,
  onSlugGenerate,
  isLoading,
  errors,
}: CompanyCreateProps) {
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

  const requiredLabelStyle = useMemo(
    () => ({
      color: colors.errorText,
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

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setName(e.target.value);
    },
    [form]
  );

  const handleSlugChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      form.setSlug(e.target.value);
    },
    [form]
  );

  const handleNameBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      if (form.name && !form.slug) {
        onSlugGenerate(form.name);
      }
    },
    [form.name, form.slug, onSlugGenerate]
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
      <Link href={companyRoutes.platform.list} style={backLinkStyle}>
        ← Back to Companies
      </Link>

      <h1 style={headingStyle}>Create Company</h1>

      <Card padding="lg">
        <form onSubmit={onSubmit} style={formContainerStyle}>
          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Company Name <span style={requiredLabelStyle}>*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter company name"
              value={form.name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              error={!!errors.name}
              errorMessage={errors.name}
              required
            />
          </div>

          <div style={fieldGroupStyle}>
            <label style={labelStyle}>
              Company Slug <span style={requiredLabelStyle}>*</span>
            </label>
            <Input
              type="text"
              placeholder="Enter company slug (e.g., acme-corp)"
              value={form.slug}
              onChange={handleSlugChange}
              error={!!errors.slug}
              errorMessage={errors.slug}
              required
            />
            <p style={helperTextStyle}>
              Lowercase alphanumeric with hyphens only. Auto-generated from name if left empty.
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
            <Button type="submit" isLoading={isLoading} disabled={!form.isCreateValid}>
              Create Company
            </Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});


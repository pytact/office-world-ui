// Company Settings UI Component
// Pure UI component following R7

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { companyRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedCompanyDetail } from "@/hooks/useCompanyTransformations";
import type { useCompanyStatus } from "@/hooks/useCompanyStatus";

interface CompanySettingsProps {
  company: TransformedCompanyDetail;
  status: ReturnType<typeof useCompanyStatus>;
  onCancel: () => void;
}

export const CompanySettings = React.memo(function CompanySettings({
  company,
  status,
  onCancel,
}: CompanySettingsProps) {
  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
      maxWidth: "1000px",
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

  const fieldRowStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[1],
      marginBottom: spacing[4],
    } as const),
    []
  );

  const fieldLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    } as const),
    []
  );

  const fieldValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[6],
      paddingTop: spacing[6],
      borderTop: `1px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <Link href={companyRoutes.platform.detail(company.company_id)} style={backLinkStyle}>
        ← Back to Company Details
      </Link>

      <h1 style={headingStyle}>Company Settings: {company.name}</h1>

      <Card>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>General Settings</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Name</span>
            <span style={fieldValueStyle}>{company.name}</span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Slug</span>
            <span style={fieldValueStyle}>{company.slug}</span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Status</span>
            <Badge variant={status.statusBadge.variant}>
              {status.statusBadge.label}
            </Badge>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Access Control</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Active</span>
            <span style={fieldValueStyle}>
              {company.is_active ? "Yes" : "No"}
            </span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Deleted</span>
            <span style={fieldValueStyle}>
              {company.is_deleted ? "Yes" : "No"}
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>User Management</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Total Users</span>
            <span style={fieldValueStyle}>{company.user_count}</span>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <Button onClick={onCancel} type="button" variant="secondary">
            Back to Details
          </Button>
        </div>
      </Card>
    </div>
  );
});


// Company Settings UI Component for CEO
// Pure UI component following R7

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { companyRoutes, userRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { CompanyProfileResponse } from "@/utils/types/responses/company";

interface CompanySettingsCEOProps {
  profile: CompanyProfileResponse;
  userCount: number;
  onCancel: () => void;
}

export const CompanySettingsCEO = React.memo(function CompanySettingsCEO({
  profile,
  userCount,
  onCancel,
}: CompanySettingsCEOProps) {
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

  const linkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
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
      <Link href={companyRoutes.profile.view} style={backLinkStyle}>
        ← Back to Company Profile
      </Link>

      <h1 style={headingStyle}>Company Settings: {profile.name}</h1>

      <Card>
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>General Settings</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Name</span>
            <span style={fieldValueStyle}>{profile.name}</span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Company Slug</span>
            <span style={fieldValueStyle}>{profile.slug}</span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Status</span>
            <Badge variant={profile.is_active ? "success" : "error"}>
              {profile.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>User Management</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Total Users</span>
            <span style={fieldValueStyle}>
              <Link href={userRoutes.company.list} style={linkStyle}>
                {userCount} Users
              </Link>
            </span>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Quick Actions</h2>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Manage Users</span>
            <span style={fieldValueStyle}>
              <Link href={userRoutes.company.list} style={linkStyle}>
                View All Users →
              </Link>
            </span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Invite New User</span>
            <span style={fieldValueStyle}>
              <Link href={userRoutes.company.invite} style={linkStyle}>
                Invite User →
              </Link>
            </span>
          </div>

          <div style={fieldRowStyle}>
            <span style={fieldLabelStyle}>Edit Company Profile</span>
            <span style={fieldValueStyle}>
              <Link href={companyRoutes.profile.view} style={linkStyle}>
                Edit Profile →
              </Link>
            </span>
          </div>
        </div>

        <div style={buttonContainerStyle}>
          <Button onClick={onCancel} type="button" variant="secondary">
            Back to Profile
          </Button>
        </div>
      </Card>
    </div>
  );
});


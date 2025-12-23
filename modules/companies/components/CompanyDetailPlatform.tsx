// Company Detail Platform UI Component
// SCR_COMPANY_DETAIL_PLATFORM - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { companyRoutes } from "@/utils/routes";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedCompanyDetail } from "@/hooks/useCompanyTransformations";
import type { useCompanyStatus } from "@/hooks/useCompanyStatus";

interface CompanyDetailPlatformProps {
  company: TransformedCompanyDetail;
  status: ReturnType<typeof useCompanyStatus>;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onSoftDelete?: () => void;
  onRestore?: () => void;
  onCancel: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isSoftDeleting?: boolean;
  isRestoring?: boolean;
}

export const CompanyDetailPlatform = React.memo(function CompanyDetailPlatform({
  company,
  status,
  onActivate,
  onDeactivate,
  onDelete,
  onSoftDelete,
  onRestore,
  onCancel,
  isUpdating,
  isDeleting,
  isSoftDeleting = false,
  isRestoring = false,
}: CompanyDetailPlatformProps) {
  const router = useRouter();
  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
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

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[8],
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
    } as const),
    []
  );

  const sectionStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      paddingBottom: spacing[3],
      borderBottom: `2px solid ${colors.borderLight}`,
    } as const),
    []
  );

  // Modern field grid layout
  const fieldGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: spacing[5],
      rowGap: spacing[6],
    } as const),
    []
  );

  const fieldItemStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "4px",
    } as const),
    []
  );

  const fieldLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    } as const),
    []
  );

  const fieldValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const actionsContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[6],
      paddingTop: spacing[6],
      borderTop: `1px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  const linkStyle = useMemo(
    () => ({
      color: colors.primary,
    } as const),
    []
  );

  const deleteButtonStyle = useMemo(
    () => ({
      backgroundColor: colors.errorText,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <Link href={companyRoutes.platform.list} style={backLinkStyle}>
        ← Back to Companies
      </Link>

      <div style={headerStyle}>
        <h1 style={headingStyle}>{company.name}</h1>
        <Badge variant={status.statusBadge.variant}>
          {status.statusBadge.label}
        </Badge>
      </div>

      <Card padding="lg" variant="default">
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Company Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Company ID</span>
              <span style={fieldValueStyle}>{company.company_id}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Name</span>
              <span style={fieldValueStyle}>{company.name}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Slug</span>
              <span style={fieldValueStyle}>{company.slug}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Description</span>
              <span style={fieldValueStyle}>{company.description || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Status</span>
              <Badge variant={status.statusBadge.variant}>
                {status.statusBadge.label}
              </Badge>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>User Count</span>
              <span style={fieldValueStyle}>
                <Link
                  href={`${userRoutes.platform.list}?company_slug=${company.slug}`}
                  style={linkStyle}
                >
                  {company.user_count} Users
                </Link>
              </span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Address Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Address</span>
              <span style={fieldValueStyle}>{company.address || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>City</span>
              <span style={fieldValueStyle}>{company.city || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>State</span>
              <span style={fieldValueStyle}>{company.state || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Country</span>
              <span style={fieldValueStyle}>{company.country || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Postal Code</span>
              <span style={fieldValueStyle}>{company.postal_code || "—"}</span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Additional Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Website</span>
              <span style={fieldValueStyle}>
                {company.website ? (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {company.website}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Logo URL</span>
              <span style={fieldValueStyle}>
                {company.logo_url ? (
                  <a
                    href={company.logo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                  >
                    {company.logo_url}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Company Analytics</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Total Users</span>
              <span style={fieldValueStyle}>
                <Link
                  href={`${userRoutes.platform.list}?company_slug=${company.slug}`}
                  style={linkStyle}
                >
                  {company.user_count} Users
                </Link>
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Company Status</span>
              <Badge variant={status.statusBadge.variant}>
                {status.statusBadge.label}
              </Badge>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Created</span>
              <span style={fieldValueStyle}>{company.createdAtFormatted}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Last Updated</span>
              <span style={fieldValueStyle}>{company.updatedAtFormatted}</span>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>Audit Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Created At</span>
              <span style={fieldValueStyle}>{company.createdAtFormatted}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Updated At</span>
              <span style={fieldValueStyle}>{company.updatedAtFormatted}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Created By</span>
              <span style={fieldValueStyle}>{company.createdByLabel || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Updated By</span>
              <span style={fieldValueStyle}>{company.updatedByLabel || "—"}</span>
            </div>
          </div>
        </div>

        <div style={actionsContainerStyle}>
          <Button
            onClick={() => router.push(companyRoutes.platform.edit(company.company_id))}
            type="button"
          >
            Edit Company
          </Button>
          <Button
            onClick={() => router.push(`${userRoutes.platform.invite}?company_slug=${company.slug}&role_code=ceo`)}
            type="button"
          >
            Assign CEO
          </Button>
          {status.canActivate && (
            <Button onClick={onActivate} isLoading={isUpdating} type="button">
              Activate Company
            </Button>
          )}
          {status.canDeactivate && (
            <Button onClick={onDeactivate} isLoading={isUpdating} type="button">
              Deactivate Company
            </Button>
          )}
          {company.is_deleted && onRestore && (
            <Button
              onClick={onRestore}
              isLoading={isRestoring}
              type="button"
            >
              Restore Company
            </Button>
          )}
          {status.canDelete && (
            <Button
              onClick={onDelete}
              isLoading={isDeleting}
              type="button"
              style={deleteButtonStyle}
            >
              Hard Delete
            </Button>
          )}
          <Button
            onClick={() => router.push(companyRoutes.platform.settings(company.company_id))}
            type="button"
            variant="secondary"
          >
            Settings
          </Button>
          <Button onClick={onCancel} type="button" variant="secondary">
            Back to List
          </Button>
        </div>
      </Card>
    </div>
  );
});


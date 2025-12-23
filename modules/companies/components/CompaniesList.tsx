// Companies List UI Component
// Pure UI component following R7
// Composes UI primitives

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";
import { CompanyResponse } from "@/utils/types/responses/user";

interface CompaniesListProps {
  companies: CompanyResponse[];
}

export const CompaniesList = React.memo(function CompaniesList({
  companies,
}: CompaniesListProps) {
  const router = useRouter();

  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
      backgroundColor: colors.backgroundPrimary,
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

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[6],
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
    } as const),
    []
  );

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: spacing[6],
    } as const),
    []
  );

  const cardContentStyle = useMemo(
    () => ({
      padding: spacing[4],
    } as const),
    []
  );

  const companyNameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const companySlugStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const badgeContainerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[2],
      marginBottom: spacing[4],
    } as const),
    []
  );

  const buttonContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
      marginTop: spacing[4],
    } as const),
    []
  );

  const handleViewDetails = useCallback(
    (companyId: string) => {
      router.push(`/platform/companies/${companyId}`);
    },
    [router]
  );

  const handleEdit = useCallback(
    (companyId: string) => {
      router.push(`/platform/companies/${companyId}/edit`);
    },
    [router]
  );

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: spacing[4] }}>
        <Link href="/platform/dashboard" style={backLinkStyle}>
          ← Back to Dashboard
        </Link>
      </div>

      <div style={headerStyle}>
        <h1 style={headingStyle}>Companies</h1>
        <Button
          onClick={() => router.push("/platform/companies/create")}
          type="button"
        >
          Create Company
        </Button>
      </div>

      <div style={gridStyle}>
        {companies.map((company) => (
          <Card key={company.company_id}>
            <div style={cardContentStyle}>
              <h3 style={companyNameStyle}>{company.name}</h3>
              <p style={companySlugStyle}>Slug: {company.slug}</p>

              <div style={badgeContainerStyle}>
                <Badge variant={company.is_active ? "success" : "error"}>
                  {company.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div style={buttonContainerStyle}>
                <Button
                  onClick={() => handleViewDetails(company.company_id)}
                  type="button"
                  style={{ flex: 1 }}
                >
                  View Details
                </Button>
                <Button
                  onClick={() => handleEdit(company.company_id)}
                  type="button"
                  style={{ 
                    flex: 1,
                    backgroundColor: colors.backgroundSecondary,
                    color: colors.textPrimary,
                    border: `1px solid ${colors.borderDefault}`,
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});


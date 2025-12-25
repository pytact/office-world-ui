// Company Dashboard Container
// Company user dashboard (CEO, HR, Manager, Employee)
// Following R7: Container component with hooks and business logic

"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useGetCompanyProfile } from "@/hooks/useCompanies";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui";
import { colors, spacing, typography, borderRadius, shadows } from "@/theme/tokens";
import { employeeRoutes, companyRoutes, userRoutes } from "@/utils/routes";
import { salaryRoutes } from "@/utils/routes/salary.routes";
import { projectRoutes } from "@/utils/routes/project.routes";

export function CompanyDashboardContainer() {
  const { user, canAccessSalary } = useAuthContext();
  const router = useRouter();

  const currentUserRole = user?.role?.toLowerCase() || "";
  const isCEO = currentUserRole === "ceo";
  const isHR = currentUserRole === "hr";
  const isManager = currentUserRole === "manager";
  const isEmployee = currentUserRole === "employee";

  // Fetch company profile - CEO/HR only
  const { data: companyProfile, isLoading: isLoadingProfile } = useGetCompanyProfile();

  const companyName = companyProfile?.data?.name || "Company";

  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      backgroundColor: colors.backgroundSecondary,
      minHeight: "100vh",
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[12],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[3],
      lineHeight: typography.lineHeight.h1,
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const subtitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const statsGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: spacing[6],
      marginBottom: spacing[12],
    } as const),
    []
  );

  const statValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      marginBottom: spacing[2],
      lineHeight: typography.lineHeight.h2,
      letterSpacing: "-0.01em",
    } as const),
    []
  );

  const statLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const quickActionsStyle = useMemo(
    () => ({
      marginBottom: spacing[12],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[8],
      lineHeight: typography.lineHeight.h3,
      letterSpacing: "-0.01em",
    } as const),
    []
  );

  const actionsGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: spacing[4],
    } as const),
    []
  );

  if ((isCEO || isHR || isManager) && isLoadingProfile) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Company Dashboard</h1>
        <p style={subtitleStyle}>
          Welcome, {user?.first_name} {user?.last_name} ({user?.role})
        </p>
        {companyName && companyName !== "Company" && (
          <p style={subtitleStyle}>{companyName}</p>
        )}
      </div>

      {/* CEO/HR/Manager Analytics Section */}
      {(isCEO || isHR || isManager) && (
        <>
          <div style={statsGridStyle}>
            <Card variant="elevated" padding="lg">
              <div style={statValueStyle}>
                {companyProfile?.data?.is_active ? "Active" : "Inactive"}
              </div>
              <div style={statLabelStyle}>Company Status</div>
            </Card>
          </div>

          <div style={quickActionsStyle}>
            <h2 style={sectionTitleStyle}>Quick Actions</h2>
            <div style={actionsGridStyle}>
              <Button
                onClick={() => router.push(projectRoutes.company.list)}
                type="button"
                variant="primary"
              >
                View Projects
              </Button>
              {(isCEO || isManager) && (
                <Button
                  onClick={() => router.push(projectRoutes.company.create)}
                  type="button"
                  variant="primary"
                >
                  Create Project
                </Button>
              )}
              <Button
                onClick={() => router.push(employeeRoutes.company.list)}
                type="button"
              >
                View All Employees
              </Button>
              {(isCEO || isHR) && (
                <Button
                  onClick={() => router.push(userRoutes.company.invite)}
                  type="button"
                  variant="primary"
                >
                  Invite Employee
                </Button>
              )}
              {canAccessSalary && (
                <Button
                  onClick={() => router.push(employeeRoutes.company.list)}
                  type="button"
                  variant="primary"
                >
                  Manage Salaries
                </Button>
              )}
              <Button
                onClick={() => router.push(companyRoutes.profile.view)}
                type="button"
              >
                Company Profile
              </Button>
              <Button
                onClick={() => router.push("/company/user-profile")}
                type="button"
                variant="secondary"
              >
                My Profile
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Manager Dashboard */}
      {isManager && (
        <>
          <div style={quickActionsStyle}>
            <h2 style={sectionTitleStyle}>Quick Actions</h2>
            <div style={actionsGridStyle}>
              <Button
                onClick={() => router.push(projectRoutes.company.list)}
                type="button"
                variant="primary"
              >
                View Projects
              </Button>
              <Button
                onClick={() => router.push(projectRoutes.company.create)}
                type="button"
                variant="primary"
              >
                Create Project
              </Button>
              <Button
                onClick={() => router.push(employeeRoutes.company.list)}
                type="button"
              >
                View Employees
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Employee Dashboard */}
      {isEmployee && (
        <>
          <div style={quickActionsStyle}>
            <h2 style={sectionTitleStyle}>Quick Actions</h2>
            <div style={actionsGridStyle}>
              <Button
                onClick={() => router.push(projectRoutes.company.list)}
                type="button"
                variant="primary"
              >
                View Projects
              </Button>
              <Button
                onClick={() => router.push("/company/user-profile")}
                type="button"
                variant="secondary"
              >
                My Profile
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


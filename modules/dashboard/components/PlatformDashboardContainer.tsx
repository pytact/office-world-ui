// Platform Dashboard Container
// SuperAdmin dashboard
// Following R7: Container component with hooks and business logic

"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useListUsers, useCompanies } from "@/hooks/useUsers";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui";
import { colors, spacing, typography, borderRadius, shadows } from "@/theme/tokens";

export function PlatformDashboardContainer() {
  const { user } = useAuthContext();
  const router = useRouter();

  // Fetch users data (first page only for stats)
  const { data: usersData, isLoading: isLoadingUsers } = useListUsers({
    page: 1,
    page_size: 1, // Just to get total count
  });

  // Fetch companies data
  const { data: companiesData, isLoading: isLoadingCompanies } = useCompanies();

  const totalUsers = usersData?.data?.total || 0;
  const totalCompanies = companiesData?.data?.items?.length || 0;

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
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: spacing[6],
    } as const),
    []
  );

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (isLoadingUsers || isLoadingCompanies) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Platform Dashboard</h1>
        <p style={subtitleStyle}>
          Welcome, {user?.first_name} {user?.last_name} (SuperAdmin)
        </p>
      </div>

      {/* Quick Stats */}
      <div style={statsGridStyle}>
        <Card variant="elevated" padding="lg">
          <div style={statValueStyle}>{totalUsers}</div>
          <div style={statLabelStyle}>Total Users</div>
        </Card>
        <Card variant="elevated" padding="lg">
          <div style={statValueStyle}>{totalCompanies}</div>
          <div style={statLabelStyle}>Total Companies</div>
        </Card>
        <Card variant="elevated" padding="lg">
          <div style={statValueStyle}>-</div>
          <div style={statLabelStyle}>Active Sessions</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div style={quickActionsStyle}>
        <h2 style={sectionTitleStyle}>Quick Actions</h2>
        <div style={actionsGridStyle}>
          <Card variant="elevated" padding="lg">
            <h3
              style={{
                fontSize: typography.fontSize.h4,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing[3],
                letterSpacing: "-0.01em",
              }}
            >
              User Management
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.small,
                color: colors.textMuted,
                marginBottom: spacing[6],
                lineHeight: typography.lineHeight.body,
              }}
            >
              View and manage all users across all companies
            </p>
            <Button
              onClick={() => handleNavigate("/platform/users")}
              style={{ width: "100%" }}
            >
              View All Users
            </Button>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3
              style={{
                fontSize: typography.fontSize.h4,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing[3],
                letterSpacing: "-0.01em",
              }}
            >
              Company Management
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.small,
                color: colors.textMuted,
                marginBottom: spacing[6],
                lineHeight: typography.lineHeight.body,
              }}
            >
              View and manage all companies on the platform
            </p>
            <Button
              onClick={() => handleNavigate("/platform/companies")}
              style={{ width: "100%" }}
            >
              View All Companies
            </Button>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3
              style={{
                fontSize: typography.fontSize.h4,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing[3],
                letterSpacing: "-0.01em",
              }}
            >
              Invite User
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.small,
                color: colors.textMuted,
                marginBottom: spacing[6],
                lineHeight: typography.lineHeight.body,
              }}
            >
              Invite a new user to any company
            </p>
            <Button
              onClick={() => handleNavigate("/platform/users/invite")}
              style={{ width: "100%" }}
            >
              Invite User
            </Button>
          </Card>

          <Card variant="elevated" padding="lg">
            <h3
              style={{
                fontSize: typography.fontSize.h4,
                fontWeight: typography.fontWeight.semibold,
                fontFamily: typography.fontFamily,
                color: colors.textPrimary,
                marginBottom: spacing[3],
                letterSpacing: "-0.01em",
              }}
            >
              View All Roles
            </h3>
            <p
              style={{
                fontSize: typography.fontSize.small,
                color: colors.textMuted,
                marginBottom: spacing[6],
                lineHeight: typography.lineHeight.body,
              }}
            >
              View all available roles in the system
            </p>
            <Button
              onClick={() => handleNavigate("/platform/roles")}
              style={{ width: "100%" }}
            >
              View All Roles
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}


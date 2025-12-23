// UserListCompany UI Component
// SCR_USER_LIST_COMPANY - Pure UI component following R7
// Following R17: UX Perception & Intent Governance applied
// PHASE-UX-0: Monitoring Screen - Review and manage company users
// PHASE-UX-1: Visual Dominance - Primary: Invite User (CEO/HR) or Table (Manager)
// PHASE-UX-2: Information Density - Collapsible filters, max 7 actionable items
// PHASE-UX-3: High-Frequency - Minimal UI, faster paths
// PHASE-UX-4: Flow Continuity - Empty states guide to next action

"use client";

import React, { useMemo, useCallback, useState } from "react";
import Link from "next/link";
import { Button, Card } from "@/components/ui";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { UserPagination } from "./UserPagination";
import { useAuthContext } from "@/context";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors, borderRadius, shadows } from "@/theme/tokens";
import type { MappedUser } from "@/hooks/useMappedUser";
import type { useUserFilters } from "@/hooks/useUserFilters";
import type { useUserPagination } from "@/hooks/useUserPagination";

interface UserListCompanyProps {
  users: MappedUser[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
  };
  filters: ReturnType<typeof useUserFilters>;
  paginationControls: ReturnType<typeof useUserPagination>;
}

export const UserListCompany = React.memo(function UserListCompany({
  users,
  pagination,
  filters,
  paginationControls,
}: UserListCompanyProps) {
  const { user: currentUser } = useAuthContext();
  const currentUserRole = currentUser?.role?.toLowerCase() || "";
  const isCEO = currentUserRole === "ceo";
  const isHR = currentUserRole === "hr";
  const canInviteUsers = isCEO || isHR;

  // PHASE-UX-2: Collapsible filters to reduce initial cognitive load
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Memoized style objects following R17: Visual Dominance Rule
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: colors.backgroundSecondary,
      minHeight: "100vh",
    } as const),
    []
  );

  // PHASE-UX-1: Header with visual dominance for primary action
  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[8],
      paddingBottom: spacing[6],
      borderBottom: `2px solid ${colors.borderLight}`,
    } as const),
    []
  );

  // PHASE-UX-1: Title - Secondary dominance
  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  // PHASE-UX-1: Primary action button - Visually dominant
  const primaryButtonStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
      padding: `${spacing[3]} ${spacing[6]}`,
    } as const),
    []
  );

  // PHASE-UX-2: Filters section - Collapsible
  const filtersToggleStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing[4],
      padding: spacing[4],
      backgroundColor: colors.backgroundPrimary,
      borderRadius: borderRadius.md,
      border: `1px solid ${colors.borderDefault}`,
      cursor: "pointer",
      transition: "all 0.2s ease",
    } as const),
    []
  );

  const filtersContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
      display: isFiltersExpanded ? "block" : "none",
    } as const),
    [isFiltersExpanded]
  );

  const tableContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // PHASE-UX-3: Tertiary - Back link (subtle)
  const backLinkStyle = useMemo(
    () => ({
      color: colors.textMuted,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.small,
      marginBottom: spacing[6],
      display: "inline-block",
      fontWeight: typography.fontWeight.normal,
      transition: "color 0.2s ease",
    } as const),
    []
  );

  // Memoized handlers
  const handleStatusChange = useCallback(
    (value: string | null) => {
      filters.setStatus(value as "active" | "inactive" | "pending" | "expired" | "activated" | null);
    },
    [filters]
  );

  const toggleFilters = useCallback(() => {
    setIsFiltersExpanded((prev) => !prev);
  }, []);

  return (
    <div style={containerStyle}>
      {/* PHASE-UX-1: Tertiary - Back link (subtle, top-left) */}
      <div style={{ marginBottom: spacing[4] }}>
        <Link 
          href="/company/dashboard" 
          style={backLinkStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = colors.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = colors.textMuted;
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* PHASE-UX-1: Header Group - Primary action visually dominant */}
      <div style={headerStyle}>
        <h1 style={headingStyle}>Company Users</h1>
        {canInviteUsers && (
          <Link href={userRoutes.company.invite}>
            <Button 
              type="button" 
              style={primaryButtonStyle}
              size="lg"
            >
              Invite User
            </Button>
          </Link>
        )}
      </div>

      {/* PHASE-UX-2: Filter Group - Collapsible to reduce cognitive load */}
      <div 
        style={filtersToggleStyle}
        onClick={toggleFilters}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundPrimary;
        }}
      >
        <span
          style={{
            fontSize: typography.fontSize.body,
            fontFamily: typography.fontFamily,
            fontWeight: typography.fontWeight.medium,
            color: colors.textPrimary,
          }}
        >
          {isFiltersExpanded ? "▼" : "▶"} Filters
          {filters.hasActiveFilters && (
            <span
              style={{
                marginLeft: spacing[2],
                fontSize: typography.fontSize.small,
                color: colors.primary,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              ({Object.values({
                search: filters.search,
                roleCode: filters.roleCode,
                status: filters.status,
              }).filter(Boolean).length} active)
            </span>
          )}
        </span>
      </div>

      <div style={filtersContainerStyle}>
        <UserFilters
          search={filters.search}
          roleCode={filters.roleCode}
          status={filters.status}
          companySlug={filters.companySlug}
          showCompanyFilter={false}
          onSearchChange={filters.setSearch}
          onRoleChange={filters.setRoleCode}
          onStatusChange={handleStatusChange}
          onCompanyChange={filters.setCompanySlug}
          onReset={filters.resetFilters}
          hasActiveFilters={filters.hasActiveFilters}
        />
      </div>

      {/* PHASE-UX-1: Content Group - User table (main content) */}
      <div style={tableContainerStyle}>
        <UserTable users={users} showCompany={false} />
      </div>

      {/* PHASE-UX-1: Navigation Group - Pagination (utility, bottom) */}
      <UserPagination
        page={pagination.page}
        pageSize={pagination.pageSize}
        total={pagination.total}
        totalPages={pagination.totalPages}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        onPageChange={paginationControls.setPage}
        onPageSizeChange={paginationControls.setPageSize}
      />
    </div>
  );
});


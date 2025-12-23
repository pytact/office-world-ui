// UserListPlatform UI Component
// SCR_USER_LIST_PLATFORM - Pure UI component following R7

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { UserTable } from "./UserTable";
import { UserFilters } from "./UserFilters";
import { UserPagination } from "./UserPagination";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { MappedUser } from "@/hooks/useMappedUser";
import type { useUserFilters } from "@/hooks/useUserFilters";
import type { useUserPagination } from "@/hooks/useUserPagination";

interface UserListPlatformProps {
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

export const UserListPlatform = React.memo(function UserListPlatform({
  users,
  pagination,
  filters,
  paginationControls,
}: UserListPlatformProps) {
  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: spacing[8],
          paddingBottom: spacing[4],
          borderBottom: `1px solid ${colors.borderDefault}`,
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
      margin: 0,
    } as const),
    []
  );

  const filtersContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const tableContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // Memoized handler to prevent re-renders
  const handleStatusChange = useCallback(
    (value: string | null) => {
      filters.setStatus(value as "active" | "inactive" | "pending" | "expired" | "activated" | null);
    },
    [filters]
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

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: spacing[4] }}>
        <Link href="/platform/dashboard" style={backLinkStyle}>
          ← Back to Dashboard
        </Link>
      </div>
      <div style={headerStyle}>
        <h1 style={headingStyle}>Platform Users</h1>
        <Link href={userRoutes.platform.invite}>
          <Button type="button">Invite User</Button>
        </Link>
      </div>

      <div style={filtersContainerStyle}>
        <UserFilters
          search={filters.search}
          roleCode={filters.roleCode}
          status={filters.status}
          companySlug={filters.companySlug}
          showCompanyFilter={true}
          onSearchChange={filters.setSearch}
          onRoleChange={filters.setRoleCode}
          onStatusChange={handleStatusChange}
          onCompanyChange={filters.setCompanySlug}
          onReset={filters.resetFilters}
          hasActiveFilters={filters.hasActiveFilters}
        />
      </div>

      <div style={tableContainerStyle}>
        <UserTable users={users} showCompany={true} />
      </div>

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


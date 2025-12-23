// Company List Platform UI Component
// SCR_COMPANY_LIST_PLATFORM - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { companyRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedCompany } from "@/hooks/useCompanyTransformations";
import type { useCompanyFilters } from "@/hooks/useCompanyFilters";
import type { useCompanyPagination } from "@/hooks/useCompanyPagination";

interface CompanyListPlatformProps {
  companies: TransformedCompany[];
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
  filters: ReturnType<typeof useCompanyFilters>;
  paginationControls: ReturnType<typeof useCompanyPagination>;
}

export const CompanyListPlatform = React.memo(function CompanyListPlatform({
  companies,
  pagination,
  filters,
  paginationControls,
}: CompanyListPlatformProps) {
  const router = useRouter();

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
      display: "flex",
      gap: spacing[4],
      marginBottom: spacing[8],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const filterGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      minWidth: "200px",
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

  const tableContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const paginationContainerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
    } as const),
    []
  );

  const paginationInfoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const paginationControlsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
      alignItems: "center",
    } as const),
    []
  );

  const handleCreateCompany = useCallback(() => {
    router.push(companyRoutes.platform.create);
  }, [router]);

  const handleCompanyClick = useCallback(
    (companyId: string) => {
      router.push(companyRoutes.platform.detail(companyId));
    },
    [router]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setSearch(e.target.value);
    },
    [filters]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      filters.setStatus(
        value === "" ? null : (value as "active" | "inactive" | "deleted")
      );
    },
    [filters]
  );

  const handleSortByChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setSortBy(e.target.value);
    },
    [filters]
  );

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setSortOrder(e.target.value as "asc" | "desc");
    },
    [filters]
  );

  const handlePreviousPage = useCallback(() => {
    paginationControls.previousPage();
  }, [paginationControls]);

  const handleNextPage = useCallback(() => {
    paginationControls.nextPage();
  }, [paginationControls]);

  // Memoize Select options to prevent re-renders
  const statusOptions = useMemo(
    () => [
      { value: "", label: "All" },
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
      { value: "deleted", label: "Deleted" },
    ],
    []
  );

  const sortByOptions = useMemo(
    () => [
      { value: "created_at", label: "Created Date" },
      { value: "updated_at", label: "Updated Date" },
      { value: "name", label: "Name" },
      { value: "slug", label: "Slug" },
      { value: "is_active", label: "Status" },
    ],
    []
  );

  const sortOrderOptions = useMemo(
    () => [
      { value: "desc", label: "Descending" },
      { value: "asc", label: "Ascending" },
    ],
    []
  );

  // Memoize pagination info calculation
  const paginationInfo = useMemo(() => {
    const start = Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total);
    const end = Math.min(pagination.page * pagination.pageSize, pagination.total);
    return { start, end, total: pagination.total };
  }, [pagination.page, pagination.pageSize, pagination.total]);

  // Optimize row click handler - use data attribute instead of creating function per row
  const handleRowClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      const companyId = e.currentTarget.dataset.companyId;
      if (companyId) {
        handleCompanyClick(companyId);
      }
    },
    [handleCompanyClick]
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headingStyle}>Companies</h1>
        <Button onClick={handleCreateCompany} type="button">
          Create Company
        </Button>
      </div>

      <div style={filtersContainerStyle}>
        <div style={filterGroupStyle}>
          <label style={labelStyle}>Search</label>
          <Input
            type="text"
            placeholder="Search by name or slug..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Status</label>
          <Select
            value={filters.status || ""}
            onChange={handleStatusChange}
            options={statusOptions}
          />
        </div>

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Sort By</label>
          <Select
            value={filters.sortBy}
            onChange={handleSortByChange}
            options={sortByOptions}
          />
        </div>

        <div style={filterGroupStyle}>
          <label style={labelStyle}>Order</label>
          <Select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
          />
        </div>

        {filters.hasActiveFilters && (
          <div style={filterGroupStyle}>
            <label style={labelStyle}>&nbsp;</label>
            <Button onClick={filters.resetFilters} type="button">
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <div style={tableContainerStyle}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell header>Name</TableCell>
              <TableCell header>Slug</TableCell>
              <TableCell header>Status</TableCell>
              <TableCell header>Users</TableCell>
              <TableCell header>Created</TableCell>
              <TableCell header>Updated</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow
                key={company.company_id}
                data-company-id={company.company_id}
                onClick={() => handleCompanyClick(company.company_id)}
                hover
              >
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.slug}</TableCell>
                <TableCell>
                  <Badge variant={company.statusBadge.variant}>
                    {company.statusBadge.label}
                  </Badge>
                </TableCell>
                <TableCell>{company.user_count}</TableCell>
                <TableCell>{company.createdAtFormatted}</TableCell>
                <TableCell>{company.updatedAtFormatted}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div style={paginationContainerStyle}>
        <div style={paginationInfoStyle}>
          Showing {paginationInfo.start} to {paginationInfo.end} of {paginationInfo.total} companies
        </div>
        <div style={paginationControlsStyle}>
          <Button
            onClick={handlePreviousPage}
            disabled={!pagination.hasPreviousPage}
            type="button"
          >
            Previous
          </Button>
          <span style={paginationInfoStyle}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <Button
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
            type="button"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
});


// UserFilters Component
// Feature-specific component - R16 Layer 2

"use client";

import React, { useMemo, useCallback } from "react";
import { Input, Select, Button } from "@/components/ui";
import { Card } from "@/components/ui";
import { spacing, typography } from "@/theme/tokens";

interface UserFiltersProps {
  search: string;
  roleCode: string | null;
  status: string | null;
  companySlug: string | null;
  showCompanyFilter?: boolean;
  onSearchChange: (value: string) => void;
  onRoleChange: (value: string | null) => void;
  onStatusChange: (value: string | null) => void;
  onCompanyChange: (value: string | null) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

// Memoized options to prevent re-renders (R14)
const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "ceo", label: "CEO" },
  { value: "hr", label: "HR" },
  { value: "manager", label: "Manager" },
  { value: "employee", label: "Employee" },
];

const statusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "pending", label: "Pending" },
  { value: "expired", label: "Expired" },
  { value: "activated", label: "Activated" },
  { value: "deleted", label: "Deleted" },
];

export const UserFilters = React.memo(function UserFilters({
  search,
  roleCode,
  status,
  companySlug,
  showCompanyFilter = false,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onCompanyChange,
  onReset,
  hasActiveFilters,
}: UserFiltersProps) {
  // Memoized style objects to prevent re-renders (R15)
  const gridStyle = useMemo(
    () => ({
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: spacing[4],
          alignItems: "end",
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
              display: "block",
              marginBottom: spacing[2],
              fontSize: typography.fontSize.small,
              fontFamily: typography.fontFamily,
              fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  // Memoized handlers to prevent re-renders
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSearchChange(e.target.value);
    },
    [onSearchChange]
  );

  const handleRoleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onRoleChange(e.target.value === "" ? null : e.target.value);
    },
    [onRoleChange]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onStatusChange(e.target.value === "" ? null : e.target.value);
    },
    [onStatusChange]
  );

  const handleCompanyChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCompanyChange(e.target.value === "" ? null : e.target.value);
    },
    [onCompanyChange]
  );

  return (
    <Card>
      <div style={gridStyle}>
        <div>
          <label style={labelStyle} htmlFor="user-search">
            Search
          </label>
          <Input
            id="user-search"
            type="text"
            placeholder="Search by email or name..."
            value={search}
            onChange={handleSearchChange}
            aria-label="Search users by email or name"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="user-role-filter">
            Role
          </label>
          <Select
            id="user-role-filter"
            options={roleOptions}
            value={roleCode || ""}
            onChange={handleRoleChange}
            aria-label="Filter users by role"
          />
        </div>

        <div>
          <label style={labelStyle} htmlFor="user-status-filter">
            Status
          </label>
          <Select
            id="user-status-filter"
            options={statusOptions}
            value={status || ""}
            onChange={handleStatusChange}
            aria-label="Filter users by status"
          />
        </div>

        {showCompanyFilter && (
          <div>
            <label style={labelStyle} htmlFor="user-company-filter">
              Company
            </label>
            <Input
              id="user-company-filter"
              type="text"
              placeholder="Enter company slug to filter"
              value={companySlug || ""}
              onChange={handleCompanyChange}
              aria-label="Filter users by company slug"
            />
          </div>
        )}

        {hasActiveFilters && (
          <Button onClick={onReset} type="button">
            Reset Filters
          </Button>
        )}
      </div>
    </Card>
  );
});


// Employee Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives

"use client";

import React, { useMemo, useCallback } from "react";
import { Input, Select, Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useEmployeeFilters } from "@/hooks/useEmployeeFilters";
import {
  Department,
  EmploymentStatus,
} from "@/utils/types/requests/employee";

interface EmployeeFiltersProps {
  filters: ReturnType<typeof useEmployeeFilters>;
}

// ENUM options for filters
const departmentOptions = [
  { value: "", label: "All Departments" },
  { value: "FRONTEND", label: "Frontend" },
  { value: "BACKEND", label: "Backend" },
  { value: "FULLSTACK", label: "Full Stack" },
  { value: "QA", label: "Quality Assurance" },
  { value: "HR", label: "Human Resources" },
  { value: "DEVOPS", label: "DevOps" },
  { value: "UIUX", label: "UI/UX" },
  { value: "PRODUCT", label: "Product" },
  { value: "MARKETING", label: "Marketing" },
  { value: "DATA", label: "Data" },
  { value: "SUPPORT", label: "Support" },
];

const employmentStatusOptions = [
  { value: "", label: "All Status" },
  { value: "TRAINEE", label: "Trainee" },
  { value: "PROBATION", label: "On Probation" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "NOTICE_PERIOD", label: "Notice Period" },
  { value: "ACTIVE", label: "Active" },
  { value: "ON_HOLD", label: "On Hold" },
  { value: "TERMINATED", label: "Terminated" },
  { value: "RESIGNED", label: "Resigned" },
];

const sortByOptions = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "joining_date", label: "Joining Date" },
  { value: "job_title", label: "Job Title" },
  { value: "department", label: "Department" },
  { value: "employment_status", label: "Employment Status" },
];

const sortOrderOptions = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export const EmployeeFilters = React.memo(function EmployeeFilters({
  filters,
}: EmployeeFiltersProps) {
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
      color: colors.textPrimary,
    } as const),
    []
  );

  // Memoized handlers
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setSearch(e.target.value);
    },
    [filters]
  );

  const handleDepartmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setDepartment(
        e.target.value ? (e.target.value as Department) : null
      );
    },
    [filters]
  );

  const handleEmploymentStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setEmploymentStatus(
        e.target.value ? (e.target.value as EmploymentStatus) : null
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

  const handleReset = useCallback(() => {
    filters.resetFilters();
  }, [filters]);

  return (
    <Card padding="md">
      <div style={gridStyle}>
        <div>
          <label style={labelStyle}>Search</label>
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div>
          <label style={labelStyle}>Department</label>
          <Select
            value={filters.department || ""}
            onChange={handleDepartmentChange}
            options={departmentOptions}
          />
        </div>

        <div>
          <label style={labelStyle}>Employment Status</label>
          <Select
            value={filters.employmentStatus || ""}
            onChange={handleEmploymentStatusChange}
            options={employmentStatusOptions}
          />
        </div>

        <div>
          <label style={labelStyle}>Sort By</label>
          <Select
            value={filters.sortBy}
            onChange={handleSortByChange}
            options={sortByOptions}
          />
        </div>

        <div>
          <label style={labelStyle}>Sort Order</label>
          <Select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
          />
        </div>

        <div>
          {filters.hasActiveFilters && (
            <Button type="button" onClick={handleReset}>
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
});


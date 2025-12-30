// Report Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives for filter controls
// Following R17: Secondary actions, visually reduced

"use client";

import React, { useMemo, useCallback } from "react";
import { Input, Select, Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import { useReportFilters } from "@/hooks/useReportFilters";
import { FilterOptions } from "@/utils/types/responses/report";

interface ReportFiltersProps {
  filters: ReturnType<typeof useReportFilters>;
  filterOptions: FilterOptions | null;
}

/**
 * Report Filters Component
 * Filter controls for report view
 * Following R17: Secondary actions, visually reduced
 * Maximum 7 filter controls visible at once
 */
export const ReportFilters = React.memo(function ReportFilters({
  filters,
  filterOptions,
}: ReportFiltersProps) {
  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setStartDate(e.target.value || null);
    },
    [filters]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setEndDate(e.target.value || null);
    },
    [filters]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setStatus(e.target.value || null);
    },
    [filters]
  );

  const handleEmployeeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setEmployeeId(e.target.value || null);
    },
    [filters]
  );

  const handleDepartmentChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setDepartment(e.target.value || null);
    },
    [filters]
  );

  const handleProjectChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setProjectId(e.target.value || null);
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

  // Build status options from filter options
  const statusOptions = useMemo(() => {
    const options = [{ value: "", label: "All Status" }];
    if (filterOptions?.status) {
      filterOptions.status.forEach((status) => {
        options.push({ value: status, label: status });
      });
    }
    return options;
  }, [filterOptions?.status]);

  // Build employee options from filter options
  const employeeOptions = useMemo(() => {
    const options = [{ value: "", label: "All Employees" }];
    if (filterOptions?.employees) {
      filterOptions.employees.forEach((emp) => {
        options.push({
          value: emp.employee_id,
          label: emp.name,
        });
      });
    }
    return options;
  }, [filterOptions?.employees]);

  // Build department options from filter options
  const departmentOptions = useMemo(() => {
    const options = [{ value: "", label: "All Departments" }];
    if (filterOptions?.departments) {
      filterOptions.departments.forEach((dept) => {
        options.push({ value: dept, label: dept });
      });
    }
    return options;
  }, [filterOptions?.departments]);

  // Build project options from filter options
  const projectOptions = useMemo(() => {
    const options = [{ value: "", label: "All Projects" }];
    if (filterOptions?.projects) {
      filterOptions.projects.forEach((proj) => {
        options.push({
          value: proj.project_id,
          label: proj.name,
        });
      });
    }
    return options;
  }, [filterOptions?.projects]);

  const sortByOptions = useMemo(
    () => [
      { value: "created_at", label: "Created Date" },
      { value: "updated_at", label: "Updated Date" },
      { value: "name", label: "Name" },
      { value: "status", label: "Status" },
    ],
    []
  );

  const sortOrderOptions = useMemo(
    () => [
      { value: "desc", label: "Newest First" },
      { value: "asc", label: "Oldest First" },
    ],
    []
  );

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const rowStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      alignItems: "flex-end" as const,
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const inputGroupStyle = useMemo(
    () => ({
      flex: "1 1 200px" as const,
      minWidth: "200px",
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Date Range Row */}
      <div style={rowStyle}>
        <div style={inputGroupStyle}>
          <label
            style={{
              display: "block",
              fontSize: typography.fontSize.small,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing[2],
              fontFamily: typography.fontFamily,
            }}
          >
            Start Date
          </label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={handleStartDateChange}
          />
        </div>
        <div style={inputGroupStyle}>
          <label
            style={{
              display: "block",
              fontSize: typography.fontSize.small,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing[2],
              fontFamily: typography.fontFamily,
            }}
          >
            End Date
          </label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={handleEndDateChange}
          />
        </div>
      </div>

      {/* Status, Employee, Department, Project Row */}
      <div style={rowStyle}>
        {filterOptions?.status && (
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing[2],
                fontFamily: typography.fontFamily,
              }}
            >
              Status
            </label>
            <Select
              value={filters.status || ""}
              onChange={handleStatusChange}
              options={statusOptions}
            />
          </div>
        )}
        {filterOptions?.employees && (
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing[2],
                fontFamily: typography.fontFamily,
              }}
            >
              Employee
            </label>
            <Select
              value={filters.employeeId || ""}
              onChange={handleEmployeeChange}
              options={employeeOptions}
            />
          </div>
        )}
        {filterOptions?.departments && (
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing[2],
                fontFamily: typography.fontFamily,
              }}
            >
              Department
            </label>
            <Select
              value={filters.department || ""}
              onChange={handleDepartmentChange}
              options={departmentOptions}
            />
          </div>
        )}
        {filterOptions?.projects && (
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                marginBottom: spacing[2],
                fontFamily: typography.fontFamily,
              }}
            >
              Project
            </label>
            <Select
              value={filters.projectId || ""}
              onChange={handleProjectChange}
              options={projectOptions}
            />
          </div>
        )}
      </div>

      {/* Sort Controls Row */}
      <div style={rowStyle}>
        <div style={inputGroupStyle}>
          <label
            style={{
              display: "block",
              fontSize: typography.fontSize.small,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing[2],
              fontFamily: typography.fontFamily,
            }}
          >
            Sort By
          </label>
          <Select
            value={filters.sortBy}
            onChange={handleSortByChange}
            options={sortByOptions}
          />
        </div>
        <div style={inputGroupStyle}>
          <label
            style={{
              display: "block",
              fontSize: typography.fontSize.small,
              fontWeight: typography.fontWeight.medium,
              color: colors.textPrimary,
              marginBottom: spacing[2],
              fontFamily: typography.fontFamily,
            }}
          >
            Order
          </label>
          <Select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <Button
            variant="secondary"
            size="md"
            onClick={filters.resetFilters}
            disabled={!filters.hasActiveFilters}
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
});


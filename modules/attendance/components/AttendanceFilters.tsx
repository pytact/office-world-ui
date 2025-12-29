// Attendance Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives for filter controls
// Following R17: Secondary actions, visually reduced, collapsible

"use client";

import React, { useMemo, useCallback, useState } from "react";
import { Input, Select, Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useAttendanceFilters } from "@/hooks/useAttendanceFilters";
import { AttendanceStatus } from "@/utils/types/requests/attendance";

interface AttendanceFiltersProps {
  filters: ReturnType<typeof useAttendanceFilters>;
  showEmployeeFilter?: boolean; // For company attendance (HR/CEO only)
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Status" },
  { value: "NOT_STARTED", label: "Not Started" },
  { value: "CHECKED_IN", label: "Checked In" },
  { value: "CHECKED_OUT", label: "Checked Out" },
];

const SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: "attendance_date", label: "Date" },
  { value: "check_in_time", label: "Check In Time" },
  { value: "check_out_time", label: "Check Out Time" },
  { value: "worked_time", label: "Worked Time" },
];

const COMPANY_SORT_BY_OPTIONS: { value: string; label: string }[] = [
  { value: "attendance_date", label: "Date" },
  { value: "check_in_time", label: "Check In Time" },
  { value: "check_out_time", label: "Check Out Time" },
  { value: "worked_time", label: "Worked Time" },
  { value: "employee_name", label: "Employee Name" },
];

const SORT_ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

/**
 * Attendance Filters Component
 * Filter controls for attendance list
 * Following R17: Secondary actions, visually reduced, collapsible
 */
export const AttendanceFilters = React.memo(function AttendanceFilters({
  filters,
  showEmployeeFilter = false,
}: AttendanceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setStatus((e.target.value || null) as AttendanceStatus | null);
    },
    [filters]
  );

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

  const handleEmployeeIdChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setEmployeeId(e.target.value || null);
    },
    [filters]
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const containerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
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

  const toggleButtonContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[2],
    } as const),
    []
  );

  const sortByOptions = showEmployeeFilter
    ? COMPANY_SORT_BY_OPTIONS
    : SORT_BY_OPTIONS;

  const handleResetFilters = useCallback(() => {
    filters.resetFilters();
  }, [filters]);

  return (
    <div style={containerStyle}>
      <div style={toggleButtonContainerStyle}>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleToggleExpanded}
        >
          {isExpanded ? "▼ Hide Filters" : "▶ Show Filters"}
        </Button>
      </div>
      {isExpanded && (
        <div style={rowStyle}>
          {showEmployeeFilter && (
            <div style={inputGroupStyle}>
              <Input
                type="text"
                placeholder="Employee ID (HR/CEO only)"
                value={filters.employeeId || ""}
                onChange={handleEmployeeIdChange}
              />
            </div>
          )}
          <div style={inputGroupStyle}>
            <Select
              value={filters.status || ""}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
            />
          </div>
          <div style={inputGroupStyle}>
            <Input
              type="date"
              placeholder="Start Date"
              value={filters.startDate || ""}
              onChange={handleStartDateChange}
            />
          </div>
          <div style={inputGroupStyle}>
            <Input
              type="date"
              placeholder="End Date"
              value={filters.endDate || ""}
              onChange={handleEndDateChange}
            />
          </div>
          <div style={inputGroupStyle}>
            <Select
              value={filters.sortBy}
              onChange={handleSortByChange}
              options={sortByOptions}
            />
          </div>
          <div style={inputGroupStyle}>
            <Select
              value={filters.sortOrder}
              onChange={handleSortOrderChange}
              options={SORT_ORDER_OPTIONS}
            />
          </div>
          <div style={inputGroupStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleResetFilters}
              disabled={!filters.hasActiveFilters}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});


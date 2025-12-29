// Audit Log Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives for filter controls
// Following R17: Secondary actions, visually reduced, collapsible

"use client";

import React, { useMemo, useCallback, useState } from "react";
import { Input, Select, Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useAuditLogFilters } from "@/hooks/useAuditLogFilters";

interface AuditLogFiltersProps {
  filters: ReturnType<typeof useAuditLogFilters>;
}

// Action Code Options (common action codes)
const ACTION_CODE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Actions" },
  { value: "USER_INVITED", label: "User Invited" },
  { value: "ROLE_ASSIGNED", label: "Role Assigned" },
  { value: "TASK_CREATED", label: "Task Created" },
  { value: "TASK_UPDATED", label: "Task Updated" },
  { value: "TASK_DELETED", label: "Task Deleted" },
  { value: "LEAVE_APPROVED", label: "Leave Approved" },
  { value: "LEAVE_REJECTED", label: "Leave Rejected" },
  { value: "SALARY_UPDATED", label: "Salary Updated" },
  { value: "ATTENDANCE_CHECK_IN", label: "Attendance Check In" },
  { value: "ATTENDANCE_CHECK_OUT", label: "Attendance Check Out" },
  { value: "SYSTEM_AUTO_CHECK_OUT", label: "System Auto Check Out" },
];

// Table Name Options
const TABLE_NAME_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Entities" },
  { value: "users", label: "Users" },
  { value: "employees", label: "Employees" },
  { value: "tasks", label: "Tasks" },
  { value: "projects", label: "Projects" },
  { value: "task_assignments", label: "Task Assignments" },
  { value: "leaves", label: "Leaves" },
  { value: "attendance", label: "Attendance" },
  { value: "salaries", label: "Salaries" },
  { value: "companies", label: "Companies" },
  { value: "notifications", label: "Notifications" },
  { value: "permissions", label: "Permissions" },
];

const SORT_ORDER_OPTIONS: { value: string; label: string }[] = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
];

/**
 * Audit Log Filters Component
 * Filter controls for audit log list
 * Following R17: Secondary actions, visually reduced, collapsible
 */
export const AuditLogFilters = React.memo(function AuditLogFilters({
  filters,
}: AuditLogFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleStartDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert date input to ISO 8601 datetime with UTC
      const dateValue = e.target.value;
      if (dateValue) {
        // Convert YYYY-MM-DD to ISO 8601 datetime UTC (YYYY-MM-DDTHH:mm:ssZ)
        const isoDateTime = `${dateValue}T00:00:00Z`;
        filters.setStartDate(isoDateTime);
      } else {
        filters.setStartDate(null);
      }
    },
    [filters]
  );

  const handleEndDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      // Convert date input to ISO 8601 datetime with UTC
      const dateValue = e.target.value;
      if (dateValue) {
        // Convert YYYY-MM-DD to ISO 8601 datetime UTC (end of day)
        const isoDateTime = `${dateValue}T23:59:59Z`;
        filters.setEndDate(isoDateTime);
      } else {
        filters.setEndDate(null);
      }
    },
    [filters]
  );

  const handleActionCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setActionCode(e.target.value || null);
    },
    [filters]
  );

  const handleTableNameChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setTableName(e.target.value || null);
    },
    [filters]
  );

  const handleSortOrderChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setSortOrder(e.target.value as "asc" | "desc");
    },
    [filters]
  );

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleResetFilters = useCallback(() => {
    filters.resetFilters();
  }, [filters]);

  // Convert ISO 8601 datetime to date input format (YYYY-MM-DD)
  const startDateInputValue = useMemo(() => {
    if (!filters.startDate) return "";
    try {
      const date = new Date(filters.startDate);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, [filters.startDate]);

  const endDateInputValue = useMemo(() => {
    if (!filters.endDate) return "";
    try {
      const date = new Date(filters.endDate);
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  }, [filters.endDate]);

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
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                marginBottom: spacing[1],
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
              }}
            >
              Start Date
            </label>
            <Input
              type="date"
              placeholder="Start Date"
              value={startDateInputValue}
              onChange={handleStartDateChange}
            />
          </div>
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                marginBottom: spacing[1],
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
              }}
            >
              End Date
            </label>
            <Input
              type="date"
              placeholder="End Date"
              value={endDateInputValue}
              onChange={handleEndDateChange}
            />
          </div>
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                marginBottom: spacing[1],
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
              }}
            >
              Action Code
            </label>
            <Select
              value={filters.actionCode || ""}
              onChange={handleActionCodeChange}
              options={ACTION_CODE_OPTIONS}
            />
          </div>
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                marginBottom: spacing[1],
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
              }}
            >
              Entity
            </label>
            <Select
              value={filters.tableName || ""}
              onChange={handleTableNameChange}
              options={TABLE_NAME_OPTIONS}
            />
          </div>
          <div style={inputGroupStyle}>
            <label
              style={{
                display: "block",
                marginBottom: spacing[1],
                fontSize: typography.fontSize.small,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                fontFamily: typography.fontFamily,
              }}
            >
              Sort Order
            </label>
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
              style={{ marginTop: spacing[5] }}
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});


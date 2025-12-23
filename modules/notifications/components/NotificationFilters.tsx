// Notification Filters Component
// F-003: Notifications System
// Following R7: Pure UI component for filter controls

"use client";

import React, { useMemo, useCallback } from "react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { useNotificationFilters } from "@/hooks/useNotificationFilters";
import { NotificationType } from "@/utils/types/requests/notification";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";

interface NotificationFiltersProps {
  filters: ReturnType<typeof useNotificationFilters>;
}

const READ_STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "true", label: "Read" },
  { value: "false", label: "Unread" },
] as const;

const TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "leave_request", label: "Leave Request" },
  { value: "leave_approval", label: "Leave Approved" },
  { value: "leave_rejection", label: "Leave Rejected" },
  { value: "leave_manager_approval", label: "Manager Leave Approval" },
  { value: "task_assignment", label: "Task Assigned" },
  { value: "task_permission_change", label: "Task Permission Changed" },
  { value: "task_status_change", label: "Task Status Changed" },
  { value: "user_activation", label: "Account Activated" },
  { value: "user_deactivation", label: "Account Deactivated" },
] as const;

const SORT_BY_OPTIONS = [
  { value: "created_at", label: "Date Created" },
  { value: "updated_at", label: "Last Updated" },
  { value: "read_at", label: "Read Date" },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
] as const;

export const NotificationFilters = React.memo(function NotificationFilters({
  filters,
}: NotificationFiltersProps) {
  const readStatusOptions = useMemo(() => READ_STATUS_OPTIONS, []);
  const typeOptions = useMemo(() => TYPE_OPTIONS, []);
  const sortByOptions = useMemo(() => SORT_BY_OPTIONS, []);
  const sortOrderOptions = useMemo(() => SORT_ORDER_OPTIONS, []);

  const handleReadStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      filters.setIsRead(
        value === "" ? null : value === "true" ? true : false
      );
    },
    [filters]
  );

  const handleTypeChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setType(
        e.target.value ? (e.target.value as NotificationType) : null
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

  const handleResetFilters = useCallback(() => {
    filters.resetFilters();
  }, [filters]);

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[4],
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
    } as const),
    []
  );

  const filtersRowStyle = useMemo(
    () => ({
      display: "flex",
      flexWrap: "wrap" as const,
      gap: spacing[4],
      alignItems: "flex-end",
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      display: "block" as const,
      marginBottom: spacing[2],
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={filtersRowStyle}>
        <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
          <label style={labelStyle}>Read Status</label>
          <Select
            value={
              filters.isRead === null
                ? ""
                : filters.isRead
                ? "true"
                : "false"
            }
            onChange={handleReadStatusChange}
            options={readStatusOptions}
          />
        </div>

        <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
          <label style={labelStyle}>Type</label>
          <Select
            value={filters.type || ""}
            onChange={handleTypeChange}
            options={typeOptions}
          />
        </div>

        <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
          <label style={labelStyle}>Sort By</label>
          <Select
            value={filters.sortBy}
            onChange={handleSortByChange}
            options={sortByOptions}
          />
        </div>

        <div style={{ flex: "1 1 200px", minWidth: "150px" }}>
          <label style={labelStyle}>Order</label>
          <Select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            options={sortOrderOptions}
          />
        </div>

        {filters.hasActiveFilters && (
          <Button onClick={handleResetFilters} type="button">
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
});


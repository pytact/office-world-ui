// Leave Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives for filter controls
// Following R17: Secondary actions, visually reduced

"use client";

import React, { useMemo, useCallback } from "react";
import { Input, Select, Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useLeaveFilters } from "@/hooks/useLeaveFilters";
import { LeaveStatus } from "@/utils/types/requests/leave";

interface LeaveFiltersProps {
  filters: ReturnType<typeof useLeaveFilters>;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "PENDING_MANAGER", label: "Pending Manager" },
  { value: "APPROVED_MANAGER", label: "Approved by Manager" },
  { value: "REJECTED_MANAGER", label: "Rejected by Manager" },
  { value: "PENDING_HR", label: "Pending HR" },
  { value: "APPROVED_HR", label: "Approved by HR" },
  { value: "REJECTED_HR", label: "Rejected by HR" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

const SORT_BY_OPTIONS = [
  { value: "created_at", label: "Created Date" },
  { value: "updated_at", label: "Updated Date" },
  { value: "start_date", label: "Start Date" },
  { value: "end_date", label: "End Date" },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
] as const;

/**
 * Leave Filters Component
 * Filter controls for leave list
 * Following R17: Secondary actions, visually reduced
 */
export const LeaveFilters = React.memo(function LeaveFilters({
  filters,
}: LeaveFiltersProps) {
  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setStatus((e.target.value || null) as LeaveStatus | null);
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

  return (
    <div style={containerStyle}>
      <div style={rowStyle}>
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
            options={SORT_BY_OPTIONS}
          />
        </div>
        <div style={inputGroupStyle}>
          <Select
            value={filters.sortOrder}
            onChange={handleSortOrderChange}
            options={SORT_ORDER_OPTIONS}
          />
        </div>
        {filters.hasActiveFilters && (
          <Button
            type="button"
            variant="secondary"
            onClick={filters.resetFilters}
          >
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
});


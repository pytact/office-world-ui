// Project Filters Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives for filter controls

"use client";

import React, { useMemo, useCallback } from "react";
import { Input, Select, Button } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useProjectFilters } from "@/hooks/useProjectFilters";

interface ProjectFiltersProps {
  filters: ReturnType<typeof useProjectFilters>;
}

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "COMPLETED", label: "Completed" },
] as const;

const SORT_BY_OPTIONS = [
  { value: "created_at", label: "Created Date" },
  { value: "name", label: "Name" },
  { value: "status", label: "Status" },
  { value: "task_count", label: "Task Count" },
] as const;

const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" },
] as const;

/**
 * Project Filters Component
 * Filter controls for project list
 * Following R17: Secondary actions, visually reduced
 */
export const ProjectFilters = React.memo(function ProjectFilters({
  filters,
}: ProjectFiltersProps) {
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      filters.setSearch(e.target.value);
    },
    [filters]
  );

  const handleStatusChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      filters.setStatus(e.target.value || null);
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
          <Input
            type="text"
            placeholder="Search projects by name..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        <div style={inputGroupStyle}>
          <Select
            value={filters.status || ""}
            onChange={handleStatusChange}
            options={STATUS_OPTIONS}
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


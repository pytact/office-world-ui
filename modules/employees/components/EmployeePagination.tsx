// Employee Pagination Component
// Feature-specific component - R16 Layer 2

"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useEmployeePagination } from "@/hooks/useEmployeePagination";

interface EmployeePaginationProps {
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
  paginationControls: ReturnType<typeof useEmployeePagination>;
}

export const EmployeePagination = React.memo(function EmployeePagination({
  pagination,
  paginationControls,
}: EmployeePaginationProps) {
  const handlePrevious = useCallback(() => {
    paginationControls.previousPage();
  }, [paginationControls]);

  const handleNext = useCallback(() => {
    paginationControls.nextPage();
  }, [paginationControls]);

  // Memoized style objects to prevent re-renders (R15)
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      gap: spacing[4],
    } as const),
    []
  );

  const infoContainerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[2],
    } as const),
    []
  );

  const infoTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const controlsContainerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[2],
    } as const),
    []
  );

  const pageInfoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      padding: `0 ${spacing[2]}`,
    } as const),
    []
  );

  const showingText = useMemo(
    () =>
      `Showing ${Math.min((pagination.page - 1) * pagination.pageSize + 1, pagination.total)} to ${Math.min(
        pagination.page * pagination.pageSize,
        pagination.total
      )} of ${pagination.total} employees`,
    [pagination.page, pagination.pageSize, pagination.total]
  );

  return (
    <div style={containerStyle}>
      <div style={infoContainerStyle}>
        <span style={infoTextStyle}>{showingText}</span>
      </div>

      <div style={controlsContainerStyle}>
        <Button
          onClick={handlePrevious}
          disabled={!pagination.hasPreviousPage}
          type="button"
        >
          Previous
        </Button>
        <span style={pageInfoStyle}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <Button
          onClick={handleNext}
          disabled={!pagination.hasNextPage}
          type="button"
        >
          Next
        </Button>
      </div>
    </div>
  );
});


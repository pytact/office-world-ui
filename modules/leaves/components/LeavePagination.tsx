// Leave Pagination Component
// Feature-specific component - R16 Layer 2
// Following R17: Tertiary action, visually reduced

"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { useLeavePagination } from "@/hooks/useLeavePagination";

interface LeavePaginationProps {
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
  paginationControls: ReturnType<typeof useLeavePagination>;
}

/**
 * Leave Pagination Component
 * Pagination controls for leave list
 * Following R17: Tertiary action, visually reduced
 */
export const LeavePagination = React.memo(function LeavePagination({
  pagination,
  paginationControls,
}: LeavePaginationProps) {
  const handlePrevious = useCallback(() => {
    paginationControls.previousPage();
  }, [paginationControls]);

  const handleNext = useCallback(() => {
    paginationControls.nextPage();
  }, [paginationControls]);

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

  const infoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
    } as const),
    []
  );

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>
        Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{" "}
        {Math.min(pagination.page * pagination.pageSize, pagination.total)} of{" "}
        {pagination.total} leaves
      </div>
      <div style={buttonGroupStyle}>
        <Button
          type="button"
          variant="secondary"
          onClick={handlePrevious}
          disabled={!pagination.hasPreviousPage}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleNext}
          disabled={!pagination.hasNextPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
});


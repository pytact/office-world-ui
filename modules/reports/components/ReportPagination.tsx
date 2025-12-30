// Report Pagination Component
// Feature-specific component - R16 Layer 2
// Following R17: Tertiary action, visually reduced

"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import { useReportPagination } from "@/hooks/useReportPagination";

interface ReportPaginationProps {
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    rowCount: number | null;
  };
  paginationControls: ReturnType<typeof useReportPagination>;
}

/**
 * Report Pagination Component
 * Pagination controls for report view
 * Following R17: Tertiary action, visually reduced
 */
export const ReportPagination = React.memo(function ReportPagination({
  pagination,
  paginationControls,
}: ReportPaginationProps) {
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

  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(pagination.page * pagination.pageSize, pagination.total);
  const totalItems = pagination.rowCount ?? pagination.total;

  return (
    <div style={containerStyle}>
      <div style={infoStyle}>
        Showing {startItem} to {endItem} of {totalItems} rows
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


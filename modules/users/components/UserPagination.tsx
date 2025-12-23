// UserPagination Component
// Feature-specific component - R16 Layer 2

"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

interface UserPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export const UserPagination = React.memo(function UserPagination({
  page,
  pageSize,
  total,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onPageSizeChange,
}: UserPaginationProps) {
  const handlePrevious = React.useCallback(() => {
    onPageChange(page - 1);
  }, [onPageChange, page]);

  const handleNext = React.useCallback(() => {
    onPageChange(page + 1);
  }, [onPageChange, page]);

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
      `Showing ${Math.min((page - 1) * pageSize + 1, total)} to ${Math.min(
        page * pageSize,
        total
      )} of ${total} users`,
    [page, pageSize, total]
  );

  return (
    <div style={containerStyle}>
      <div style={infoContainerStyle}>
        <span style={infoTextStyle}>{showingText}</span>
      </div>

      <div style={controlsContainerStyle}>
        <Button
          onClick={handlePrevious}
          disabled={!hasPreviousPage}
          type="button"
        >
          Previous
        </Button>
        <span style={pageInfoStyle}>
          Page {page} of {totalPages}
        </span>
        <Button onClick={handleNext} disabled={!hasNextPage} type="button">
          Next
        </Button>
      </div>
    </div>
  );
});


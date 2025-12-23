// Notification Pagination Component
// F-003: Notifications System
// Following R7: Pure UI component for pagination controls
// Following R14: Performance optimization with React.memo

"use client";

import React, { useMemo, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { useNotificationPagination } from "@/hooks/useNotificationPagination";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";

interface NotificationPaginationProps {
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
  paginationControls: ReturnType<typeof useNotificationPagination>;
}

export const NotificationPagination = React.memo(function NotificationPagination({
  pagination,
  paginationControls,
}: NotificationPaginationProps) {
  const handlePreviousPage = useCallback(() => {
    paginationControls.previousPage();
  }, [paginationControls]);

  const handleNextPage = useCallback(() => {
    paginationControls.nextPage();
  }, [paginationControls]);

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
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

  const textStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const buttonsContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={infoContainerStyle}>
        <span style={textStyle}>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <span style={textStyle}>({pagination.total} total)</span>
      </div>

      <div style={buttonsContainerStyle}>
        <Button
          onClick={handlePreviousPage}
          disabled={!pagination.hasPreviousPage}
          type="button"
        >
          Previous
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={!pagination.hasNextPage}
          type="button"
        >
          Next
        </Button>
      </div>
    </div>
  );
});


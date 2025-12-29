// Audit Log List Component
// Screen UI component - R16 Layer 3
// Pure UI component for audit log list screen
// Following R17: Monitoring Screen with clear visual hierarchy

"use client";

import React, { useCallback, useMemo } from "react";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogFilters } from "./AuditLogFilters";
import { spacing, typography, colors, shadows, borderRadius } from "@/theme/tokens";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import type { useAuditLogFilters } from "@/hooks/useAuditLogFilters";
import type { useAuditLogPagination } from "@/hooks/useAuditLogPagination";
import type { TransformedAuditLogSummary } from "@/hooks/useAuditLogTransformations";

interface AuditLogListProps {
  auditLogs: TransformedAuditLogSummary[];
  filters: ReturnType<typeof useAuditLogFilters>;
  pagination: ReturnType<typeof useAuditLogPagination>;
  onAuditLogClick: (auditLogId: string) => void;
}

/**
 * Audit Log List Component
 * Main UI for audit log list screen
 * Following R17: Primary action (table), Secondary action (filters)
 */
export const AuditLogList = React.memo(function AuditLogList({
  auditLogs,
  filters,
  pagination,
  onAuditLogClick,
}: AuditLogListProps) {
  // R17: Visual Hierarchy Styles
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
      padding: `${spacing[6]} ${spacing[4]}`,
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  // Primary: Header Section
  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[4],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
      lineHeight: typography.lineHeight.h2,
    } as const),
    []
  );

  // Secondary: Filter Section
  const filterSectionStyle = useMemo(
    () => ({
      marginBottom: spacing[4],
    } as const),
    []
  );

  // Primary: Table Section
  const tableCardStyle = useMemo(
    () => ({
      boxShadow: shadows.card,
      borderRadius: borderRadius.lg,
    } as const),
    []
  );

  // Tertiary: Pagination Section
  const paginationStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      padding: spacing[4],
      flexWrap: "wrap" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const paginationInfoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const paginationButtonsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
    } as const),
    []
  );

  const handlePreviousPage = useCallback(() => {
    pagination.previousPage();
  }, [pagination]);

  const handleNextPage = useCallback(() => {
    pagination.nextPage();
  }, [pagination]);

  return (
    <div style={containerStyle}>
      {/* Header Section - R17: Attention Anchor */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Audit Logs</h1>
      </div>

      {/* Secondary: Filter Section - R17: Visually Reduced */}
      <div style={filterSectionStyle}>
        <AuditLogFilters filters={filters} />
      </div>

      {/* Primary: Table Section - R17: Dominant Visual Element */}
      <div style={tableCardStyle}>
        <Card variant="elevated" padding="sm">
          <AuditLogTable
            auditLogs={auditLogs}
            onAuditLogClick={onAuditLogClick}
          />
        </Card>
      </div>

      {/* Tertiary: Pagination Section - R17: Background Element */}
      {pagination.totalPages > 0 && (
        <div style={paginationStyle}>
          <div style={paginationInfoStyle}>
            Showing page {pagination.page} of {pagination.totalPages} (
            {pagination.total} total)
          </div>
          <div style={paginationButtonsStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={handlePreviousPage}
              disabled={!pagination.hasPreviousPage}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleNextPage}
              disabled={!pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});


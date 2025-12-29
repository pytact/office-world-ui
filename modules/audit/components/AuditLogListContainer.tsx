// Audit Log List Container
// SCR_AUDIT_LOG_LIST - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AuditLogList } from "./AuditLogList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useAuditLogListData } from "@/hooks/useAuditLogListData";
import { useAuditLogContext } from "@/context/AuditLogContext";
import { auditLogRoutes } from "@/utils/routes";
import { spacing } from "@/theme/tokens";

export function AuditLogListContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canViewAuditLogs } = useAuditLogContext();

  // Initialize filters, pagination, and API query via useAuditLogListData
  const {
    isLoading,
    isError,
    error,
    refetch,
    auditLogs,
    pagination,
    filters,
    paginationControls,
  } = useAuditLogListData();

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: `${spacing[12]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // Memoized handlers (R14: Performance) - MUST be before early returns (R15 Issue 12)
  const handleAuditLogClick = useCallback(
    (auditLogId: string) => {
      router.push(auditLogRoutes.company.detail(auditLogId));
    },
    [router]
  );

  // Memoized empty state action handler (R14: Performance)
  const handleClearFilters = useCallback(() => {
    filters.resetFilters();
  }, [filters]);

  // Permission check (AFTER all hooks)
  if (!canViewAuditLogs) {
    return (
      <AccessDenied
        message="You do not have permission to access audit logs. Only CEO, HR, and Manager roles can view audit logs."
      />
    );
  }

  // Loading state (AFTER all hooks)
  if (isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load audit logs"}
        onRetry={refetch}
      />
    );
  }

  // Empty state
  if (!auditLogs || auditLogs.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message={
            filters.hasActiveFilters
              ? "No audit logs match your filters"
              : "No audit logs found"
          }
          description={
            filters.hasActiveFilters
              ? "Try adjusting your search or filter criteria to see more results."
              : "No audit logs are available at this time."
          }
          actionText={filters.hasActiveFilters ? "Clear Filters" : undefined}
          onActionClick={filters.hasActiveFilters ? handleClearFilters : undefined}
        />
      </div>
    );
  }

  return (
    <AuditLogList
      auditLogs={auditLogs}
      filters={filters}
      pagination={paginationControls}
      onAuditLogClick={handleAuditLogClick}
    />
  );
}


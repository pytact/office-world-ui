// Audit Log Detail Container
// SCR_AUDIT_LOG_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { AuditLogDetail } from "./AuditLogDetail";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useGetAuditLog } from "@/hooks/useAuditLogs";
import { useAuditLogContext } from "@/context/AuditLogContext";
import { useAuditLogDetailTransformation } from "@/hooks/useAuditLogTransformations";
import { auditLogRoutes } from "@/utils/routes";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { spacing } from "@/theme/tokens";

export function AuditLogDetailContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const auditLogId = params?.auditLogId as string | undefined;

  const { permissions } = useAuditLogContext();

  // Get audit log detail
  const auditLogQuery = useGetAuditLog(auditLogId || null);

  // Transform audit log data
  const rawAuditLog = auditLogQuery.data?.data || null;
  const transformedAuditLog = useAuditLogDetailTransformation(rawAuditLog);

  // Memoized handlers (R14: Performance) - MUST be before early returns (R15 Issue 12)
  const handleBack = useCallback(() => {
    router.push(auditLogRoutes.company.list);
  }, [router]);

  // Memoized retry handler (R14: Performance)
  const handleRetry = useCallback(() => {
    auditLogQuery.refetch();
  }, [auditLogQuery]);

  // Check permissions if we have the audit log data
  const hasPermission = useMemo(() => {
    if (!rawAuditLog) return true; // Wait for data before checking
    return permissions.canViewAuditLogDetail(rawAuditLog.table_name);
  }, [rawAuditLog, permissions]);

  // Loading state (AFTER all hooks)
  if (auditLogQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (auditLogQuery.isError) {
    const error = auditLogQuery.error as NormalizedError | Error | undefined;
    // Check if it's a 403 or 404 error
    const statusCode = (error as NormalizedError)?.statusCode;
    const errorCode = (error as NormalizedError)?.error?.code;
    if (statusCode === 403 || errorCode === "INSUFFICIENT_PERMISSIONS") {
      return (
        <AccessDenied
          message="You do not have permission to view this audit log. Manager role can only view audit logs for tasks, projects, or task assignments."
        />
      );
    }
    if (statusCode === 404 || errorCode === "AUDIT_LOG_NOT_FOUND") {
      return (
        <ErrorState
          message="Audit log not found. The audit log you're looking for doesn't exist or has been removed."
          onRetry={handleRetry}
        />
      );
    }
    const errorMessage = (error as NormalizedError)?.message || (error as Error)?.message || "Failed to load audit log";
    return (
      <ErrorState
        message={errorMessage}
        onRetry={handleRetry}
      />
    );
  }

  // Permission check (AFTER loading check)
  if (!hasPermission) {
    return (
      <AccessDenied
        message="You do not have permission to view this audit log. Manager role can only view audit logs for tasks, projects, or task assignments."
      />
    );
  }

  // No data state
  if (!transformedAuditLog) {
    return (
      <ErrorState
        message="Audit log not found. The audit log you're looking for doesn't exist."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <AuditLogDetail auditLog={transformedAuditLog} onBack={handleBack} />
  );
}


// Audit Log Hooks
// F-011: Audit Logging & Activity History
// React Query hooks for audit log operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules
// Note: This is a read-only API - audit logs are system-generated only

import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { AuditLogService } from "@/services/auditLog.service";
import {
  AuditLogListParams,
} from "@/utils/types/requests/auditLog";

/**
 * Hook for listing audit logs with pagination, filtering, and sorting
 * GET /api/v1/company/audit-logs
 * 
 * Supports filtering by:
 * - Date range (start_date, end_date)
 * - Action code (action_code)
 * - Table name (table_name)
 * 
 * Supports sorting by:
 * - created_at (only allowed field)
 * - Sort order: asc or desc (default: desc)
 * 
 * Visibility is role-based:
 * - CEO/HR: All audit logs within their company
 * - Manager: Only audit logs where table_name ∈ {tasks, projects, task_assignments}
 * - Employee: No access (403 error)
 * - SuperAdmin: Blocked (403 error)
 * 
 * Company scoping is automatic from JWT org_id claim
 * 
 * @param params - Query parameters for filtering, pagination, and sorting
 * @returns Query object with audit log list data and state
 */
export function useListAuditLogs(params?: AuditLogListParams) {
  return useQuery({
    queryKey: [
      "audit-logs",
      params?.page,
      params?.page_size,
      params?.start_date,
      params?.end_date,
      params?.action_code,
      params?.table_name,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => AuditLogService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently as new audit logs are generated
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false, // Don't refetch on window focus (audit logs are historical data)
  });
}

/**
 * Hook for getting a single audit log by ID
 * GET /api/v1/company/audit-logs/{audit_log_id}
 * 
 * Returns detailed audit log information including:
 * - old_values and new_values (field changes)
 * - IP address and user agent
 * - Full actor information
 * 
 * Supports ETag-based cache validation with If-None-Match header
 * Returns 304 Not Modified if ETag matches (no response body)
 * 
 * Visibility is role-based:
 * - CEO/HR: Can access any company audit log
 * - Manager: Can only access logs where table_name ∈ {tasks, projects, task_assignments}
 *   Returns 403 if accessing log outside allowed scope
 * - Employee: No access (403 error)
 * - SuperAdmin: Blocked (403 error)
 * 
 * Company scoping is automatic from JWT org_id claim
 * 
 * Note: Audit logs are immutable, so longer staleTime is appropriate
 * 
 * @param audit_log_id - Audit log identifier (UUID format)
 * @param etag - Optional ETag value for conditional GET (cache validation)
 * @returns Query object with audit log detail data and state
 */
export function useGetAuditLog(
  audit_log_id: string | null,
  etag?: string
) {
  return useQuery({
    queryKey: ["audit-log", audit_log_id, etag],
    queryFn: () => {
      if (!audit_log_id) {
        throw new Error("Audit log ID is required");
      }

      return AuditLogService.getById(audit_log_id, etag);
    },
    enabled: !!audit_log_id, // Only run query if audit_log_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - audit logs are immutable, so longer cache is safe
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus (audit logs are immutable)
  });
}

/**
 * Note: No create, update, or delete hooks
 * Audit logs are system-generated only and immutable
 * UI never creates, edits, or deletes audit records
 * These operations are handled asynchronously by other features (F-001 through F-010)
 */


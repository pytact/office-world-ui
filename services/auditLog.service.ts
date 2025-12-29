// Audit Log Service
// F-011: Audit Logging & Activity History
// Following R8 rules: API Calls & Error Handling
// Note: This is a read-only API - audit logs are system-generated only
// No create, update, or delete operations are available

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  AuditLogListParams,
} from "@/utils/types/requests/auditLog";

import {
  AuditLogListResponse,
  AuditLogDetailResponse,
} from "@/utils/types/responses/auditLog";

const basePath = "/v1/company/audit-logs";

export const AuditLogService = {
  /**
   * GET /api/v1/company/audit-logs
   * List audit logs with pagination, filtering, and sorting for the authenticated user's company
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
   * @param params - Optional query parameters for filtering, pagination, and sorting
   * @returns Promise<AuditLogListResponse> - Paginated list of audit logs
   */
  list: async (params?: AuditLogListParams): Promise<AuditLogListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
      }
      if (params?.action_code) {
        searchParams.append("action_code", params.action_code);
      }
      if (params?.table_name) {
        searchParams.append("table_name", params.table_name);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const r = await http.get<AuditLogListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/audit-logs/{audit_log_id}
   * Get detailed audit log information including old_values, new_values, IP address, and user agent
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
   * @param audit_log_id - Audit log identifier (UUID format)
   * @param etag - Optional ETag value for conditional GET (cache validation)
   * @returns Promise<AuditLogDetailResponse> - Detailed audit log information
   */
  getById: async (
    audit_log_id: string,
    etag?: string
  ): Promise<AuditLogDetailResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.get<AuditLogDetailResponse>(
        `${basePath}/${audit_log_id}`,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

};
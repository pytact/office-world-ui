// Report Service
// F-012: Reports & Analytics
// Following R8 rules: API Calls & Error Handling
// Note: Reports are read-only derived models - no update or delete operations
// Export operations are the only write operations

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

import {
  ReportListParams,
  ReportViewParams,
  ExportCreate,
  ReportType,
} from "@/utils/types/requests/report";

import {
  ReportTypeListResponse,
  ReportViewResponse,
  ExportCreationResponse,
  ExportStatusResponse,
} from "@/utils/types/responses/report";

const basePath = "/v1/reports";

export const ReportService = {
  /**
   * GET /api/v1/reports
   * List all report types accessible to the authenticated user's role
   * 
   * Returns report types filtered server-side by role:
   * - CEO/HR: All report types
   * - Manager: ATTENDANCE, PROJECT, TASK only
   * - Employee: ATTENDANCE, LEAVE, TASK only (self-scoped)
   * - SuperAdmin: Empty list (no access)
   * 
   * @param params - Optional query parameters (currently none, but kept for consistency)
   * @returns Promise<ReportTypeListResponse> - List of accessible report types with count
   */
  list: async (params?: ReportListParams): Promise<ReportTypeListResponse> => {
    try {
      // No query parameters for this endpoint - returns all accessible reports based on role
      const r = await http.get<ReportTypeListResponse>(basePath);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/reports/{report_type}
   * Get report data with optional filters, pagination, and sorting
   * 
   * Returns aggregated report data with:
   * - Metadata (report type, title, description, filter options)
   * - Rows (report-specific data, null for aggregate reports like SALARY_SUMMARY)
   * - Totals (aggregated totals, structure varies by report type)
   * - Pagination (for list-style reports, null for aggregate reports)
   * 
   * Supports filtering by:
   * - Date range (start_date, end_date)
   * - Status (varies by report type)
   * - Employee ID (role-restricted)
   * - Department (exact match)
   * - Project ID (UUID)
   * 
   * Supports pagination (for list-style reports):
   * - page (default: 1, min: 1)
   * - page_size (default: 20, range: 1-100)
   * 
   * Supports sorting:
   * - sort_by (varies by report type, default: "created_at")
   * - sort_order ("asc" or "desc", default: "desc")
   * 
   * Visibility is role-based:
   * - CEO/HR: All report types (company-scoped)
   * - Manager: ATTENDANCE, PROJECT, TASK only (company-scoped)
   * - Employee: ATTENDANCE, LEAVE, TASK only (self-scoped)
   * - SuperAdmin: No access (403 error)
   * 
   * Company scoping is automatic from JWT org_id claim
   * 
   * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
   * @param params - Optional query parameters for filtering, pagination, and sorting
   * @returns Promise<ReportViewResponse> - Report view data with metadata, rows, totals, and pagination
   */
  getById: async (
    report_type: ReportType,
    params?: ReportViewParams
  ): Promise<ReportViewResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.start_date) {
        searchParams.append("start_date", params.start_date);
      }
      if (params?.end_date) {
        searchParams.append("end_date", params.end_date);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.employee_id) {
        searchParams.append("employee_id", params.employee_id);
      }
      if (params?.department) {
        searchParams.append("department", params.department);
      }
      if (params?.project_id) {
        searchParams.append("project_id", params.project_id);
      }
      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString
        ? `${basePath}/${report_type}?${queryString}`
        : `${basePath}/${report_type}`;

      const r = await http.get<ReportViewResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/reports/{report_type}/exports
   * Create an asynchronous PDF export of a report view with applied filters
   * 
   * Export generation is asynchronous:
   * - Returns immediately with export_id and status (PENDING)
   * - Use getExportStatus() to poll for completion
   * - Export expires after 24 hours
   * 
   * Export respects:
   * - Role-based access (same as report view access)
   * - Filter restrictions (same as report view filters)
   * - Company scoping (automatic from JWT org_id)
   * 
   * Empty filters object {} exports default report view (no filters)
   * 
   * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
   * @param payload - Export creation payload with optional filters
   * @returns Promise<ExportCreationResponse> - Export creation response with export_id and status
   */
  create: async (
    report_type: ReportType,
    payload?: ExportCreate
  ): Promise<ExportCreationResponse> => {
    try {
      const r = await http.post<ExportCreationResponse>(
        `${basePath}/${report_type}/exports`,
        payload || {}
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/reports/{report_type}/exports/{export_id}
   * Check export status (polling endpoint for async export processing)
   * 
   * Export status values:
   * - PENDING: Export request created, waiting to be processed
   * - PROCESSING: Export is being generated
   * - COMPLETED: Export is ready for download (includes file_url and file_size)
   * - FAILED: Export generation failed (includes error_message)
   * - EXPIRED: Export artifact has expired (24 hours TTL exceeded)
   * 
   * Access control:
   * - User must own the export (created by authenticated user)
   * - OR user must have access to the report type (for admin/audit purposes)
   * 
   * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
   * @param export_id - Export identifier (UUID format)
   * @returns Promise<ExportStatusResponse> - Export status response with current status and metadata
   */
  getExportStatus: async (
    report_type: ReportType,
    export_id: string
  ): Promise<ExportStatusResponse> => {
    try {
      const r = await http.get<ExportStatusResponse>(
        `${basePath}/${report_type}/exports/${export_id}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/reports/{report_type}/exports/{export_id}/download
   * Download generated PDF export
   * 
   * Returns raw binary PDF file data with Content-Type: application/pdf
   * 
   * Requirements:
   * - Export must be in COMPLETED status
   * - Export must not be expired (24 hours TTL)
   * - User must own the export or have admin access
   * 
   * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
   * @param export_id - Export identifier (UUID format)
   * @returns Promise<Blob> - PDF file data as Blob
   */
  downloadExport: async (
    report_type: ReportType,
    export_id: string
  ): Promise<Blob> => {
    try {
      const r = await http.get<Blob>(
        `${basePath}/${report_type}/exports/${export_id}/download`,
        {
          responseType: "blob",
        }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },


};
// Report Hooks
// F-012: Reports & Analytics
// React Query hooks for report operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules
// Note: Reports are read-only derived models - no update or delete operations
// Export operations are the only write operations

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { ReportService } from "@/services/report.service";
import {
  ReportListParams,
  ReportViewParams,
  ExportCreate,
  ReportType,
} from "@/utils/types/requests/report";

/**
 * Hook for listing accessible report types
 * GET /api/v1/reports
 * 
 * Returns report types filtered server-side by role:
 * - CEO/HR: All report types
 * - Manager: ATTENDANCE, PROJECT, TASK only
 * - Employee: ATTENDANCE, LEAVE, TASK only (self-scoped)
 * - SuperAdmin: Empty list (no access)
 * 
 * Report types are relatively static (change infrequently with feature updates)
 * Longer staleTime is appropriate for this metadata
 * 
 * @param params - Optional query parameters (currently none, but kept for consistency)
 * @returns Query object with report type list data and state
 */
export function useListReports(params?: ReportListParams) {
  return useQuery({
    queryKey: ["reports", "types", params],
    queryFn: () => ReportService.list(params),
    staleTime: 5 * 60 * 1000, // 5 minutes - report types are static metadata
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus (static metadata)
  });
}

/**
 * Hook for getting report view data with filters, pagination, and sorting
 * GET /api/v1/reports/{report_type}
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
 * Reports are near real-time with acceptable caching
 * Shorter staleTime for report data (changes as underlying data changes)
 * 
 * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
 * @param params - Optional query parameters for filtering, pagination, and sorting
 * @returns Query object with report view data and state
 */
export function useGetReport(
  report_type: ReportType | null,
  params?: ReportViewParams
) {
  return useQuery({
    queryKey: [
      "report",
      report_type,
      params?.start_date,
      params?.end_date,
      params?.status,
      params?.employee_id,
      params?.department,
      params?.project_id,
      params?.page,
      params?.page_size,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => {
      if (!report_type) {
        throw new Error("Report type is required");
      }

      return ReportService.getById(report_type, params);
    },
    enabled: !!report_type, // Only run query if report_type is provided
    staleTime: 30 * 1000, // 30 seconds - report data is near real-time
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions for list-style reports
    refetchOnWindowFocus: false, // Don't refetch on window focus (user can manually refresh)
  });
}

/**
 * Hook for creating an asynchronous PDF export
 * POST /api/v1/reports/{report_type}/exports
 * 
 * Export generation is asynchronous:
 * - Returns immediately with export_id and status (PENDING)
 * - Use useGetExportStatus() to poll for completion
 * - Export expires after 24 hours
 * 
 * Export respects:
 * - Role-based access (same as report view access)
 * - Filter restrictions (same as report view filters)
 * - Company scoping (automatic from JWT org_id)
 * 
 * Empty filters object {} exports default report view (no filters)
 * 
 * Cache invalidation:
 * - Invalidates export status queries for the report type
 * - Does not invalidate report view (export is a snapshot)
 * 
 * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
 * @returns Mutation object with create function and state
 */
export function useCreateExport(report_type: ReportType) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload?: ExportCreate) =>
      ReportService.create(report_type, payload),
    onSuccess: async (data) => {
      // Invalidate export status queries for this report type
      // This ensures the new export appears in status checks
      await queryClient.invalidateQueries({
        queryKey: ["report", report_type, "exports"],
      });
      // Invalidate specific export status if we have the export_id
      if (data?.data?.export_id) {
        await queryClient.invalidateQueries({
          queryKey: ["report", report_type, "export", data.data.export_id],
        });
      }
    },
  });
}

/**
 * Hook for checking export status (polling endpoint for async export processing)
 * GET /api/v1/reports/{report_type}/exports/{export_id}
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
 * Polling strategy:
 * - Use refetchInterval to poll for status updates
 * - Stop polling when status is COMPLETED, FAILED, or EXPIRED
 * - Shorter staleTime for active polling
 * 
 * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
 * @param export_id - Export identifier (UUID format)
 * @param options - Optional polling configuration
 * @returns Query object with export status data and state
 */
export function useGetExportStatus(
  report_type: ReportType | null,
  export_id: string | null,
  options?: {
    enabled?: boolean;
    refetchInterval?: number | false;
  }
) {
  return useQuery({
    queryKey: ["report", report_type, "export", export_id],
    queryFn: () => {
      if (!report_type || !export_id) {
        throw new Error("Report type and export ID are required");
      }

      return ReportService.getExportStatus(report_type, export_id);
    },
    enabled:
      (options?.enabled !== false && !!report_type && !!export_id) ||
      options?.enabled === true,
    staleTime: 2 * 1000, // 2 seconds - very short for active polling
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: options?.refetchInterval ?? false, // Polling controlled by caller
    refetchOnWindowFocus: false, // Don't refetch on window focus (polling handles updates)
  });
}

/**
 * Hook for downloading generated PDF export
 * GET /api/v1/reports/{report_type}/exports/{export_id}/download
 * 
 * Returns raw binary PDF file data with Content-Type: application/pdf
 * 
 * Requirements:
 * - Export must be in COMPLETED status
 * - Export must not be expired (24 hours TTL)
 * - User must own the export or have admin access
 * 
 * This is a mutation because it triggers a download action
 * Downloads are typically one-time operations, so no caching needed
 * 
 * @param report_type - Report type code (ATTENDANCE, LEAVE, SALARY_SUMMARY, etc.)
 * @returns Mutation object with download function and state
 */
export function useDownloadExport(report_type: ReportType) {
  return useMutation({
    mutationFn: (export_id: string) =>
      ReportService.downloadExport(report_type, export_id),
    // No cache invalidation needed - downloads are one-time operations
  });
}

/**
 * Update operation is not applicable for Reports
 * Reports are read-only derived models - no update operations available
 * 
 * @deprecated Reports are read-only - use useCreateExport() for exports instead
 * @returns Never - always throws error
 */
export function useUpdateReport(): never {
  throw new Error(
    "Update operation is not supported for Reports. Reports are read-only derived models."
  );
}

/**
 * Delete operation is not applicable for Reports
 * Reports are read-only derived models - no delete operations available
 * 
 * @deprecated Reports are read-only - no delete operations available
 * @returns Never - always throws error
 */
export function useDeleteReport(): never {
  throw new Error(
    "Delete operation is not supported for Reports. Reports are read-only derived models."
  );
}


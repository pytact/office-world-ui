// Report View Container
// SCR_REPORT_VIEW - Container component following R6 and R17
// Handles business logic, hooks, and state management

"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ReportView } from "./ReportView";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useReportListData } from "@/hooks/useReportListData";
import { useReportContext } from "@/context/ReportContext";
import { useGetExportStatus } from "@/hooks/useReports";
import { ReportType } from "@/utils/types/requests/report";
import { reportRoutes } from "@/utils/routes/report.routes";
import { useToast } from "@/context/ToastContext";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { ReportService } from "@/services/report.service";

export function ReportViewContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const reportType = (params?.reportType as ReportType) || null;

  const { canAccessReportType, canExportReports } = useReportContext();
  const { showError } = useToast();

  // Check if user has access to this report type
  const hasAccess = React.useMemo(() => {
    if (!reportType) return false;
    return canAccessReportType(reportType);
  }, [reportType, canAccessReportType]);

  // Get report data
  const reportData = useReportListData({
    reportType,
    initialPage: 1,
    initialPageSize: 50,
  });

  // Export state
  const [exportId, setExportId] = React.useState<string | null>(null);
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportingEmployeeName, setExportingEmployeeName] = React.useState<string | null>(null);

  // Get export status if export is in progress
  const exportStatusQuery = useGetExportStatus(reportType, exportId, {
    enabled: !!reportType && !!exportId,
    refetchInterval: 2000,
  });

  // Handle export creation (full report)
  // R14: Memoized callback to prevent re-creation on every render
  // Note: Using ReportService directly since reportType is dynamic (from route params)
  // This is acceptable for mutations with dynamic parameters
  const handleExport = React.useCallback(async () => {
    if (!reportType || !canExportReports) return;

    try {
      setIsExporting(true);
      setIsDownloading(false); // Reset download state for new export
      setExportingEmployeeName(null); // Full report export
      // R14: Call service directly with current reportType (dynamic parameter)
      // This is acceptable since reportType is validated before this callback is used
      const response = await ReportService.create(reportType, {
        filters: reportData.filters.getParams(),
      });
      setExportId(response.data.export_id);
    } catch (error) {
      const normalizedError = normalizeAPIError(error);
      showError(normalizedError.message || "Failed to create export. Please try again.");
      setIsExporting(false);
      setIsDownloading(false);
      setExportingEmployeeName(null);
    }
  }, [reportType, canExportReports, reportData.filters, showError]);

  // Handle per-row export (specific employee report)
  // R14: Memoized callback to prevent re-creation on every render
  const handleExportRow = React.useCallback(
    async (rowData: Record<string, unknown>) => {
      if (!reportType || !canExportReports) return;

      // Extract employee_id or assigned_to from row data (different reports use different fields)
      const employeeId =
        (rowData.employee_id as string | undefined) ||
        (rowData.assigned_to as string | undefined);
      const employeeName =
        (rowData.employeeNameFormatted as string) ||
        (rowData.assignedToNameFormatted as string) ||
        (rowData.employee_name as string) ||
        null;

      if (!employeeId) {
        showError("Unable to export: Employee identifier not found in row data.");
        return;
      }

      try {
        setIsExporting(true);
        setIsDownloading(false); // Reset download state for new export
        setExportingEmployeeName(employeeName);
        // Create export with employee_id filter to export only this employee's data
        const currentFilters = reportData.filters.getParams();
        const response = await ReportService.create(reportType, {
          filters: {
            ...currentFilters,
            employee_id: employeeId,
          },
        });
        setExportId(response.data.export_id);
      } catch (error) {
        const normalizedError = normalizeAPIError(error);
        showError(
          normalizedError.message || "Failed to create employee export. Please try again."
        );
        setIsExporting(false);
        setIsDownloading(false);
        setExportingEmployeeName(null);
      }
    },
    [reportType, canExportReports, reportData.filters, showError]
  );

  // Track if download is in progress to prevent multiple downloads
  const [isDownloading, setIsDownloading] = React.useState(false);

  // Export status and progress message (MUST be before early returns)
  const exportStatus = exportStatusQuery.data?.data?.status;
  const exportProgress = React.useMemo(() => {
    if (isDownloading) {
      return "Downloading PDF...";
    }
    if (exportStatus === "PENDING" || exportStatus === "PROCESSING") {
      return "Processing...";
    }
    if (exportStatus === "COMPLETED") {
      return "Preparing download...";
    }
    if (exportStatus === "FAILED") {
      return "Failed";
    }
    return null;
  }, [exportStatus, isDownloading]);

  // Handle export download when ready
  React.useEffect(() => {
    // Only proceed if export is completed and we haven't already started downloading
    if (
      exportStatusQuery.data?.data?.status === "COMPLETED" &&
      exportStatusQuery.data?.data?.file_url &&
      !isDownloading &&
      exportId
    ) {
      const downloadFile = async () => {
        setIsDownloading(true);
        try {
          // R14: Call service directly with current reportType (dynamic parameter)
          // This API call downloads the PDF blob
          const blob = await ReportService.downloadExport(reportType!, exportId);

          // Create download link with appropriate filename
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          
          // Generate filename based on export type
          const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
          let filename = `${reportType}_report_${timestamp}`;
          if (exportingEmployeeName) {
            // Sanitize employee name for filename (remove special characters)
            const sanitizedName = exportingEmployeeName
              .replace(/[^a-zA-Z0-9]/g, "_")
              .substring(0, 50); // Limit length
            filename = `${reportType}_report_${sanitizedName}_${timestamp}`;
          }
          filename = `${filename}.pdf`;
          
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          // Reset export state only after successful download
          setExportId(null);
          setIsExporting(false);
          setIsDownloading(false);
          setExportingEmployeeName(null);
        } catch (error) {
          const normalizedError = normalizeAPIError(error);
          showError(normalizedError.message || "Failed to download export. Please try again.");
          setIsExporting(false);
          setIsDownloading(false);
          setExportId(null);
          setExportingEmployeeName(null);
        }
      };

      downloadFile();
    } else if (
      exportStatusQuery.data?.data?.status === "FAILED" ||
      exportStatusQuery.data?.data?.status === "EXPIRED"
    ) {
      // Export failed or expired - stop loading
      setIsExporting(false);
      setIsDownloading(false);
      setExportId(null);
      setExportingEmployeeName(null);
    }
  }, [
    exportStatusQuery.data?.data?.status,
    exportStatusQuery.data?.data?.file_url,
    reportType,
    exportId,
    exportingEmployeeName,
    isDownloading,
    showError,
  ]);

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: "48px 24px",
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // R14: Memoize back to reports handler to prevent inline function
  const handleBackToReports = React.useCallback(() => {
    router.push(reportRoutes.company.list);
  }, [router]);

  // Invalid report type or no access
  if (!reportType || !hasAccess) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message="Report Not Available"
          description="You don't have access to this report type. Please select a different report from the reports home page."
          actionText="Back to Reports"
          onActionClick={handleBackToReports}
        />
      </div>
    );
  }

  // Loading state (AFTER all hooks)
  if (reportData.isLoading) {
    return <Loader message="Loading report data..." />;
  }

  // Error state (AFTER all hooks)
  if (reportData.isError) {
    return (
      <ErrorState
        message={reportData.error?.message || "Failed to load report data"}
        onRetry={reportData.refetch}
      />
    );
  }

  // Empty state - R17: Enhanced with clear guidance and next steps
  if (reportData.isEmpty) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message="No data found"
          description={
            reportData.filters.hasActiveFilters
              ? "No data matches your selected filters. Try adjusting your date range, status, or other filter criteria."
              : "No data is available for this report at this time."
          }
          actionText={
            reportData.filters.hasActiveFilters ? "Clear Filters" : undefined
          }
          onActionClick={
            reportData.filters.hasActiveFilters
              ? reportData.filters.resetFilters
              : undefined
          }
        />
      </div>
    );
  }

  // Success state
  const handleBackClick = () => {
    router.push(reportRoutes.company.list);
  };

  return (
    <ReportView
      reportType={reportType}
      metadata={reportData.metadata}
      rows={reportData.transformedRows}
      totals={reportData.totals}
      pagination={reportData.pagination}
      hasPagination={reportData.hasPagination}
      filters={reportData.filters}
      paginationControls={reportData.paginationControls}
      canExport={canExportReports && reportData.hasExport}
      isExporting={isExporting}
      exportProgress={exportProgress}
      onExport={handleExport}
      onExportRow={handleExportRow}
      onBack={handleBackClick}
    />
  );
}


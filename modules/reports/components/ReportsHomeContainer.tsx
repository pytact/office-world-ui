// Reports Home Container
// SCR_REPORTS_HOME - Container component following R6 and R17
// Handles business logic, hooks, and state management

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ReportsHome } from "./ReportsHome";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useListReports } from "@/hooks/useReports";
import { useReportContext } from "@/context/ReportContext";
import { reportRoutes } from "@/utils/routes/report.routes";
import { ReportType } from "@/utils/types/requests/report";

export function ReportsHomeContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canAccessReports, accessibleReportTypes } = useReportContext();
  const { data, isLoading, isError, error, refetch } = useListReports();

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: "48px 24px",
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // Loading state (AFTER all hooks)
  if (isLoading) {
    return <Loader message="Loading available reports..." />;
  }

  // Error state (AFTER all hooks)
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load available reports"}
        onRetry={refetch}
      />
    );
  }

  // Extract report types from response
  // API actually returns flat structure: { data: ReportTypeResponse[], available_report_count: number, message: string }
  // But TypeScript types expect nested: StandardResponse<ReportTypeListData>
  // Handle actual API response structure (flat) with type assertion
  const apiResponse = data as any; // Type assertion to handle actual API response structure
  const reportTypes: Array<{ code: string; label: string; description: string; is_accessible: boolean }> = 
    Array.isArray(apiResponse?.data) 
      ? apiResponse.data  // Flat structure from actual API: { data: [...], available_report_count: 3 }
      : apiResponse?.data?.data || [];  // Fallback for nested structure if types are correct
  const availableReports = reportTypes.filter((rt) => rt.is_accessible);
  const availableReportCount = Array.isArray(apiResponse?.data)
    ? apiResponse?.available_report_count ?? availableReports.length  // Flat structure
    : apiResponse?.data?.available_report_count ?? availableReports.length;  // Nested structure

  // Empty state - R17: Enhanced with clear guidance and next steps
  if (!availableReports || availableReports.length === 0) {
    // Role-specific empty state messages
    let emptyMessage = "No reports available";
    let emptyDescription = "You don't have access to any reports at this time.";
    let emptyActionText: string | undefined;
    let emptyActionClick: (() => void) | undefined;

    if (!canAccessReports) {
      emptyMessage = "Reports Not Available";
      emptyDescription =
        "Reports are not available for your role. Contact your administrator for access.";
    } else {
      emptyMessage = "No Reports Found";
      emptyDescription =
        "No reports are currently available. Please check back later or contact support.";
    }

    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message={emptyMessage}
          description={emptyDescription}
          actionText={emptyActionText}
          onActionClick={emptyActionClick}
        />
      </div>
    );
  }

  // Success state
  const handleReportClick = (reportTypeCode: string) => {
    router.push(reportRoutes.company.detail(reportTypeCode as ReportType));
  };

  return (
    <ReportsHome
      reportTypes={availableReports}
      availableReportCount={availableReportCount}
      onReportClick={handleReportClick}
    />
  );
}


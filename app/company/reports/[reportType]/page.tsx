// Company Report Detail Page
// Route: /company/reports/:reportType
// SCR_REPORT_VIEW
// All roles except SuperAdmin (CEO, HR, Manager, Employee) - access to specific report types differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only
// Note: Report type access is validated in the container component using ReportContext

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ReportViewContainer = dynamic(
  () =>
    import("@/modules/reports/components/ReportViewContainer").then(
      (mod) => ({ default: mod.ReportViewContainer })
    ),
  {
    loading: () => <Loader message="Loading report..." />,
    ssr: false,
  }
);

export default function CompanyReportDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager", "employee"]}>
      <ReportViewContainer />
    </RouteGuard>
  );
}


// Company Reports List Page
// Route: /company/reports
// SCR_REPORTS_HOME
// All roles except SuperAdmin (CEO, HR, Manager, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ReportsHomeContainer = dynamic(
  () =>
    import("@/modules/reports/components/ReportsHomeContainer").then(
      (mod) => ({ default: mod.ReportsHomeContainer })
    ),
  {
    loading: () => <Loader message="Loading reports..." />,
    ssr: false,
  }
);

export default function CompanyReportsPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager", "employee"]}>
      <ReportsHomeContainer />
    </RouteGuard>
  );
}


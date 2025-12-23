// Company Dashboard Page
// Route: /company/dashboard
// CEO, HR, Manager, Employee
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyDashboardContainer = dynamic(
  () =>
    import("@/modules/dashboard/components/CompanyDashboardContainer").then(
      (mod) => ({ default: mod.CompanyDashboardContainer })
    ),
  {
    loading: () => <Loader message="Loading dashboard..." />,
    ssr: false,
  }
);

export default function CompanyDashboardPage() {
  return (
    <RouteGuard
      allowedRoles={["ceo", "hr", "manager", "employee"]}
    >
      <CompanyDashboardContainer />
    </RouteGuard>
  );
}


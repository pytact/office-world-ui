// Company Employee Salary Overview Page
// Route: /company/employees/:id/salary
// SCR_EMPLOYEE_SALARY_OVERVIEW
// CEO, HR only (Employee, Manager, and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const SalaryOverviewContainer = dynamic(
  () =>
    import("@/modules/salaries/components/SalaryOverviewContainer").then(
      (mod) => ({ default: mod.SalaryOverviewContainer })
    ),
  {
    loading: () => <Loader message="Loading salary information..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeSalaryPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <SalaryOverviewContainer />
    </RouteGuard>
  );
}


// Company Employee Salary Revise Page
// Route: /company/employees/:id/salary/revise
// CEO, HR only (Employee, Manager, and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const SalaryReviseContainer = dynamic(
  () =>
    import("@/modules/salaries/components/SalaryReviseContainer").then(
      (mod) => ({ default: mod.SalaryReviseContainer })
    ),
  {
    loading: () => <Loader message="Loading salary revision form..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeSalaryRevisePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <SalaryReviseContainer />
    </RouteGuard>
  );
}


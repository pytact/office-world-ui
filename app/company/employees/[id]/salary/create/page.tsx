// Company Employee Salary Create Page
// Route: /company/employees/:id/salary/create
// CEO, HR only (Employee, Manager, and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const SalaryCreateContainer = dynamic(
  () =>
    import("@/modules/salaries/components/SalaryCreateContainer").then(
      (mod) => ({ default: mod.SalaryCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading salary form..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeSalaryCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <SalaryCreateContainer />
    </RouteGuard>
  );
}


// Company Employees List Page
// Route: /company/employees
// SCR_EMPLOYEE_LIST
// CEO, HR, Manager only (Employee and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const EmployeeListContainer = dynamic(
  () =>
    import("@/modules/employees/components/EmployeeListContainer").then(
      (mod) => ({ default: mod.EmployeeListContainer })
    ),
  {
    loading: () => <Loader message="Loading employees..." />,
    ssr: false,
  }
);

export default function CompanyEmployeesPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager"]}>
      <EmployeeListContainer />
    </RouteGuard>
  );
}


// Company Employee Create Page
// Route: /company/employees/create
// SCR_EMPLOYEE_CREATE
// CEO, HR only (Manager, Employee, SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const EmployeeCreateContainer = dynamic(
  () =>
    import("@/modules/employees/components/EmployeeCreateContainer").then(
      (mod) => ({ default: mod.EmployeeCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading employee creation form..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <EmployeeCreateContainer />
    </RouteGuard>
  );
}


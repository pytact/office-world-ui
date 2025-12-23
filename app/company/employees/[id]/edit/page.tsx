// Company Employee Edit Page
// Route: /company/employees/:id/edit
// SCR_EMPLOYEE_EDIT
// CEO, HR only (Manager, Employee, SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const EmployeeEditContainer = dynamic(
  () =>
    import("@/modules/employees/components/EmployeeEditContainer").then(
      (mod) => ({ default: mod.EmployeeEditContainer })
    ),
  {
    loading: () => <Loader message="Loading employee edit form..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeEditPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <EmployeeEditContainer />
    </RouteGuard>
  );
}


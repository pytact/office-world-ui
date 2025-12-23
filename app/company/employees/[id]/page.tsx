// Company Employee Detail Page
// Route: /company/employees/:id
// SCR_EMPLOYEE_DETAIL
// CEO, HR, Manager only (Employee and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const EmployeeDetailContainer = dynamic(
  () =>
    import("@/modules/employees/components/EmployeeDetailContainer").then(
      (mod) => ({ default: mod.EmployeeDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading employee details..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager"]}>
      <EmployeeDetailContainer />
    </RouteGuard>
  );
}


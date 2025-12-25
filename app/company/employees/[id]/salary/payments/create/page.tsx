// Company Employee Salary Payment Create Page
// Route: /company/employees/:id/salary/payments/create
// SCR_SALARY_PAYMENT_CREATE
// CEO, HR only (Employee, Manager, and SuperAdmin blocked)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const SalaryPaymentCreateContainer = dynamic(
  () =>
    import("@/modules/salaries/components/SalaryPaymentCreateContainer").then(
      (mod) => ({ default: mod.SalaryPaymentCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading payment form..." />,
    ssr: false,
  }
);

export default function CompanyEmployeeSalaryPaymentCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <SalaryPaymentCreateContainer />
    </RouteGuard>
  );
}


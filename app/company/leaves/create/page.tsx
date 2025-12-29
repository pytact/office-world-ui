// Company Leave Create Page
// Route: /company/leaves/create
// SCR_LEAVE_CREATE
// All roles (CEO, Manager, HR, Employee) - can create leave
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const LeaveCreateContainer = dynamic(
  () =>
    import("@/modules/leaves/components/LeaveCreateContainer").then(
      (mod) => ({ default: mod.LeaveCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading leave form..." />,
    ssr: false,
  }
);

export default function CompanyLeaveCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <LeaveCreateContainer />
    </RouteGuard>
  );
}


// Company Leaves List Page
// Route: /company/leaves
// SCR_LEAVE_LIST
// All roles (CEO, Manager, HR, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const LeaveListContainer = dynamic(
  () =>
    import("@/modules/leaves/components/LeaveListContainer").then(
      (mod) => ({ default: mod.LeaveListContainer })
    ),
  {
    loading: () => <Loader message="Loading leave requests..." />,
    ssr: false,
  }
);

export default function CompanyLeavesPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <LeaveListContainer />
    </RouteGuard>
  );
}


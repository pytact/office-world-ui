// Company Leave Detail Page
// Route: /company/leaves/:leaveId
// SCR_LEAVE_DETAIL
// All roles (CEO, Manager, HR, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const LeaveDetailContainer = dynamic(
  () =>
    import("@/modules/leaves/components/LeaveDetailContainer").then(
      (mod) => ({ default: mod.LeaveDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading leave details..." />,
    ssr: false,
  }
);

export default function CompanyLeaveDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <LeaveDetailContainer />
    </RouteGuard>
  );
}


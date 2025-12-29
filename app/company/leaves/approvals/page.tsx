// Company Leave Approval Queue Page
// Route: /company/leaves/approvals
// SCR_LEAVE_APPROVAL_QUEUE
// Approver roles (CEO, Manager, HR) - can view pending approvals
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const LeaveApprovalQueueContainer = dynamic(
  () =>
    import("@/modules/leaves/components/LeaveApprovalQueueContainer").then(
      (mod) => ({ default: mod.LeaveApprovalQueueContainer })
    ),
  {
    loading: () => <Loader message="Loading pending approvals..." />,
    ssr: false,
  }
);

export default function CompanyLeaveApprovalQueuePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr"]}>
      <LeaveApprovalQueueContainer />
    </RouteGuard>
  );
}


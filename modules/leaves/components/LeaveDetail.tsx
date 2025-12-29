// Leave Detail Component
// Screen UI component - R16 Layer 3
// Pure UI component for leave detail screen
// Following R17: Decision Screen (for approvers) / Monitoring Screen (for applicants)

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { LeaveSummaryCard } from "./LeaveSummaryCard";
import { LeaveApprovalTimeline } from "./LeaveApprovalTimeline";
import { LeaveActions } from "./LeaveActions";
import { spacing, colors } from "@/theme/tokens";
import type { TransformedLeaveDetail } from "@/hooks/useLeaveTransformations";
import { leaveRoutes } from "@/utils/routes";

interface LeaveDetailProps {
  leave: TransformedLeaveDetail;
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isCancelling?: boolean;
  userRole?: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null; // User role to conditionally hide approval timeline for HR
}

/**
 * Leave Detail Component
 * Main UI for leave detail screen
 * Following R17: Primary (approval timeline/actions), Secondary (summary card)
 * Following R14: Memoized for performance
 */
export const LeaveDetail = React.memo(function LeaveDetail({
  leave,
  canApprove,
  canReject,
  canCancel,
  onApprove,
  onReject,
  onCancel,
  isApproving = false,
  isRejecting = false,
  isCancelling = false,
  userRole,
}: LeaveDetailProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push(leaveRoutes.company.list);
  }, [router]);

  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backButtonContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const contentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={backButtonContainerStyle}>
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back to Leave Requests
        </Button>
      </div>

      {/* Content Section */}
      <div style={contentStyle}>
        {/* Primary: Approval Timeline (for applicants) or Actions (for approvers) */}
        {/* Hide approval timeline for HR role */}
        {(canApprove || canReject) ? (
          <LeaveActions
            canApprove={canApprove}
            canReject={canReject}
            canCancel={canCancel}
            isTerminal={leave.isTerminal}
            onApprove={onApprove}
            onReject={onReject}
            onCancel={onCancel}
            isApproving={isApproving}
            isRejecting={isRejecting}
            isCancelling={isCancelling}
          />
        ) : userRole !== "hr" ? (
          <LeaveApprovalTimeline leave={leave} />
        ) : null}

        {/* Secondary: Summary Card */}
        <LeaveSummaryCard leave={leave} />

        {/* Approval Timeline (for applicants) - Hide for HR role */}
        {!(canApprove || canReject) && userRole !== "hr" && (
          <LeaveApprovalTimeline leave={leave} />
        )}
      </div>
    </div>
  );
});


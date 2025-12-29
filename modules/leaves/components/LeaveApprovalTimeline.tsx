// Leave Approval Timeline Component
// Feature-specific component - R16 Layer 2
// Visualizes approval workflow status
// Following R17: Primary visual element for applicants

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedLeaveDetail } from "@/hooks/useLeaveTransformations";

interface LeaveApprovalTimelineProps {
  leave: TransformedLeaveDetail;
}

/**
 * Leave Approval Timeline Component
 * Visualizes the approval workflow stages
 * Following R17: Primary visual element for applicants
 */
export const LeaveApprovalTimeline = React.memo(function LeaveApprovalTimeline({
  leave,
}: LeaveApprovalTimelineProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      margin: 0,
    } as const),
    []
  );

  const stageStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "flex-start" as const,
      gap: spacing[4],
      padding: spacing[4],
      borderLeft: `3px solid ${colors.borderDefault}`,
      marginLeft: spacing[2],
    } as const),
    []
  );

  const stageActiveStyle = useMemo(
    () => ({
      borderLeftColor: colors.primary,
    } as const),
    []
  );

  const stageCompletedStyle = useMemo(
    () => ({
      borderLeftColor: colors.success,
    } as const),
    []
  );

  const stageRejectedStyle = useMemo(
    () => ({
      borderLeftColor: colors.error,
    } as const),
    []
  );

  const stageTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const stageInfoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  // Determine manager stage status
  const managerStageStatus = useMemo(() => {
    if (leave.manager_status === "APPROVED_MANAGER") {
      return { status: "completed", label: "Approved", timestamp: leave.managerApprovedAtFormatted };
    }
    if (leave.manager_status === "REJECTED_MANAGER") {
      return { status: "rejected", label: "Rejected", timestamp: leave.managerApprovedAtFormatted };
    }
    if (leave.manager_status === "PENDING_MANAGER") {
      return { status: "active", label: "Pending", timestamp: null };
    }
    return { status: "pending", label: "Not Started", timestamp: null };
  }, [leave.manager_status, leave.managerApprovedAtFormatted]);

  // Determine HR stage status
  const hrStageStatus = useMemo(() => {
    if (leave.hr_status === "APPROVED_HR") {
      return { status: "completed", label: "Approved", timestamp: leave.hrApprovedAtFormatted };
    }
    if (leave.hr_status === "REJECTED_HR") {
      return { status: "rejected", label: "Rejected", timestamp: leave.hrApprovedAtFormatted };
    }
    if (leave.hr_status === "PENDING_HR" && leave.manager_status === "APPROVED_MANAGER") {
      return { status: "active", label: "Pending", timestamp: null };
    }
    return { status: "pending", label: "Waiting for Manager", timestamp: null };
  }, [leave.hr_status, leave.manager_status, leave.hrApprovedAtFormatted]);

  const getStageStyle = useMemo(
    () => (status: string) => {
      if (status === "completed") return stageCompletedStyle;
      if (status === "rejected") return stageRejectedStyle;
      if (status === "active") return stageActiveStyle;
      return {};
    },
    [stageCompletedStyle, stageRejectedStyle, stageActiveStyle]
  );

  const getBadgeVariant = useMemo(
    () => (status: string): "default" | "success" | "error" | "warning" | "info" => {
      if (status === "completed") return "success";
      if (status === "rejected") return "error";
      if (status === "active") return "warning";
      return "default";
    },
    []
  );

  const flexOneStyle = useMemo(
    () => ({
      flex: 1,
    } as const),
    []
  );

  const timestampStyle = useMemo(
    () => ({
      ...stageInfoStyle,
      marginTop: spacing[2],
    } as const),
    [stageInfoStyle]
  );

  const rejectionReasonStyle = useMemo(
    () => ({
      ...stageInfoStyle,
      marginTop: spacing[2],
      color: colors.errorText,
    } as const),
    [stageInfoStyle]
  );

  return (
    <Card variant="default" padding="lg">
      <h3 style={sectionTitleStyle}>Approval Status</h3>
      <div style={containerStyle}>
        {/* Manager Stage */}
        <div style={{ ...stageStyle, ...getStageStyle(managerStageStatus.status) }}>
          <div style={flexOneStyle}>
            <div style={stageTitleStyle}>Manager Approval</div>
            <Badge variant={getBadgeVariant(managerStageStatus.status)}>
              {managerStageStatus.label}
            </Badge>
            {managerStageStatus.timestamp && (
              <div style={timestampStyle}>
                {managerStageStatus.timestamp}
              </div>
            )}
            {leave.manager_rejection_reason && (
              <div style={rejectionReasonStyle}>
                Reason: {leave.manager_rejection_reason}
              </div>
            )}
          </div>
        </div>

        {/* HR Stage */}
        <div style={{ ...stageStyle, ...getStageStyle(hrStageStatus.status) }}>
          <div style={flexOneStyle}>
            <div style={stageTitleStyle}>HR Approval</div>
            <Badge variant={getBadgeVariant(hrStageStatus.status)}>
              {hrStageStatus.label}
            </Badge>
            {hrStageStatus.timestamp && (
              <div style={timestampStyle}>
                {hrStageStatus.timestamp}
              </div>
            )}
            {leave.hr_rejection_reason && (
              <div style={rejectionReasonStyle}>
                Reason: {leave.hr_rejection_reason}
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
});


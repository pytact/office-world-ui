// Leave Actions Component
// Feature-specific component - R16 Layer 2
// Action buttons for leave detail view
// Following R17: Context-dependent actions

"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui";
import { spacing, colors } from "@/theme/tokens";

interface LeaveActionsProps {
  canApprove: boolean;
  canReject: boolean;
  canCancel: boolean;
  isTerminal: boolean;
  onApprove: () => void;
  onReject: () => void;
  onCancel: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  isCancelling?: boolean;
}

/**
 * Leave Actions Component
 * Action buttons for leave operations
 * Following R17: Context-dependent actions (approver/applicant)
 */
export const LeaveActions = React.memo(function LeaveActions({
  canApprove,
  canReject,
  canCancel,
  isTerminal,
  onApprove,
  onReject,
  onCancel,
  isApproving = false,
  isRejecting = false,
  isCancelling = false,
}: LeaveActionsProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      flexWrap: "wrap" as const,
      marginTop: spacing[6],
      paddingTop: spacing[6],
      borderTop: `2px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  // Don't show actions if leave is in terminal state and user can't cancel
  if (isTerminal && !canCancel) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {canApprove && !isTerminal && (
        <Button
          type="button"
          onClick={onApprove}
          variant="primary"
          isLoading={isApproving}
          disabled={isApproving}
        >
          Approve
        </Button>
      )}
      {canReject && !isTerminal && (
        <Button
          type="button"
          onClick={onReject}
          variant="secondary"
          isLoading={isRejecting}
          disabled={isRejecting}
        >
          Reject
        </Button>
      )}
      {canCancel && !isTerminal && (
        <Button
          type="button"
          onClick={onCancel}
          variant="secondary"
          isLoading={isCancelling}
          disabled={isCancelling}
        >
          Cancel Leave
        </Button>
      )}
    </div>
  );
});


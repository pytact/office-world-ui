// Task Actions Component
// Screen UI component - R16 Layer 3
// Action buttons for task detail view
// Following R17: Context-dependent actions

"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui";
import { spacing, colors } from "@/theme/tokens";

interface TaskActionsProps {
  canEdit: boolean;
  canChangeStatus: boolean;
  canManageAssignments: boolean;
  canDelete: boolean;
  isTerminal: boolean;
  onEdit: () => void;
  onStatusChange: () => void;
  onManageAssignments: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

/**
 * Task Actions Component
 * Action buttons for task operations
 * Following R17: Context-dependent actions (owner/editor/viewer)
 */
export const TaskActions = React.memo(function TaskActions({
  canEdit,
  canChangeStatus,
  canManageAssignments,
  canDelete,
  isTerminal,
  onEdit,
  onStatusChange,
  onManageAssignments,
  onDelete,
  isDeleting = false,
}: TaskActionsProps) {
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

  // Don't show actions if task is in terminal state and user can't edit
  if (isTerminal && !canEdit && !canDelete) {
    return null;
  }

  return (
    <div style={containerStyle}>
      {canEdit && !isTerminal && (
        <Button type="button" onClick={onEdit} variant="primary">
          Edit Task
        </Button>
      )}
      {canChangeStatus && (
        <Button type="button" onClick={onStatusChange} variant="primary">
          Change Status
        </Button>
      )}
      {canManageAssignments && (
        <Button type="button" onClick={onManageAssignments} variant="secondary">
          Manage Assignments
        </Button>
      )}
      {canDelete && (
        <Button
          type="button"
          onClick={onDelete}
          variant="secondary"
          isLoading={isDeleting}
        >
          Delete Task
        </Button>
      )}
    </div>
  );
});


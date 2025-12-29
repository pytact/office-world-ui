// Task Detail Component
// Screen UI component - R16 Layer 3
// Pure UI component for task detail screen
// Following R17: Primary (header), Secondary (content, status), Tertiary (actions)

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { TaskHeader } from "./TaskHeader";
import { TaskContent } from "./TaskContent";
import { TaskActions } from "./TaskActions";
import { TaskAssignmentList } from "./TaskAssignmentList";
import { TaskStatusControl } from "./TaskStatusControl";
import { spacing, colors } from "@/theme/tokens";
import { UseFormReturn } from "react-hook-form";
import type { TransformedTaskDetail } from "@/hooks/useTaskTransformations";
import { TaskStatus } from "@/utils/types/requests/task";
import type { TaskUpdateFormSchema } from "@/modules/tasks/forms/task.schema";

interface TaskDetailProps {
  task: TransformedTaskDetail;
  canEdit: boolean;
  canChangeStatus: boolean;
  canManageAssignments: boolean;
  canDelete: boolean;
  isTerminal: boolean;
  isEditing?: boolean;
  editForm?: UseFormReturn<TaskUpdateFormSchema>;
  onEdit: () => void;
  onSaveEdit?: (values: TaskUpdateFormSchema) => void | Promise<void>;
  onCancelEdit?: () => void;
  onStatusChange: (status: TaskStatus) => void;
  onManageAssignments: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
  isUpdatingStatus?: boolean;
  isSavingEdit?: boolean;
}

/**
 * Task Detail Component
 * Main UI for task detail screen
 * Following R17: Primary (header), Secondary (content, status), Tertiary (actions)
 * Following R14: Memoized for performance
 */
export const TaskDetail = React.memo(function TaskDetail({
  task,
  canEdit,
  canChangeStatus,
  canManageAssignments,
  canDelete,
  isTerminal,
  isEditing = false,
  editForm,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  onStatusChange,
  onManageAssignments,
  onDelete,
  isDeleting = false,
  isUpdatingStatus = false,
  isSavingEdit = false,
}: TaskDetailProps) {
  const router = useRouter();

  const handleBack = useCallback(() => {
    router.push("/company/tasks");
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

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <div style={backButtonContainerStyle}>
        <Button type="button" variant="secondary" onClick={handleBack}>
          Back to Tasks
        </Button>
      </div>

      {/* Task Header - Primary (R17: Attention Anchor) */}
      <TaskHeader task={task} />

      {/* Status Control - Secondary (if owner or editor) */}
      {canChangeStatus && (
        <TaskStatusControl
          currentStatus={task.status}
          onStatusChange={onStatusChange}
          disabled={isTerminal || isUpdatingStatus}
          isLoading={isUpdatingStatus}
        />
      )}

      {/* Task Content - Secondary */}
      <TaskContent
        task={task}
        isEditing={isEditing}
        editForm={editForm}
        onSave={onSaveEdit}
        onCancel={onCancelEdit}
        isSaving={isSavingEdit}
      />

      {/* Assignments List - Secondary */}
      {task.assignments && task.assignments.length >= 0 && (
        <TaskAssignmentList
          assignments={task.assignments}
          canManage={canManageAssignments}
          onManage={canManageAssignments ? onManageAssignments : undefined}
        />
      )}

      {/* Action Buttons - Tertiary */}
      {!isEditing && (
        <TaskActions
          canEdit={canEdit}
          canChangeStatus={canChangeStatus}
          canManageAssignments={canManageAssignments}
          canDelete={canDelete}
          isTerminal={isTerminal}
          onEdit={onEdit}
          onStatusChange={() => {
            // Status change is handled by TaskStatusControl above
          }}
          onManageAssignments={onManageAssignments}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
});


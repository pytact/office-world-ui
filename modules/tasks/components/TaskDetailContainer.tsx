// Task Detail Container
// SCR_TASK_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { TaskDetail } from "./TaskDetail";
import { TaskDeleteConfirmationModal } from "./TaskDeleteConfirmationModal";
import { TaskAssignmentModal } from "./TaskAssignmentModal";
import { TaskStatusChangeModal } from "./TaskStatusChangeModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import {
  useGetTask,
  useUpdateTask,
  useDeleteTask,
} from "@/hooks/useTasks";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";
import { useTaskContext } from "@/context/TaskContext";
import { transformTaskDetail, getTaskStatusLabel } from "@/hooks/useTaskTransformations";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { TaskStatus } from "@/utils/types/requests/task";
import type { TaskAssignmentAdd, TaskAssignmentRemove } from "@/utils/types/requests/task";
import { useTaskUpdateForm, useTaskUpdateFormSubmit } from "@/modules/tasks/forms";
import { useToast } from "@/context/ToastContext";

export function TaskDetailContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;
  const { userRole } = useTaskContext();
  const { showSuccess, showError } = useToast();

  const taskQuery = useGetTask(taskId);
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  // Local state for edit mode and modals
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [showStatusChangeModal, setShowStatusChangeModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);

  // Form for editing task (following R10)
  const editForm = useTaskUpdateForm({
    defaultValues: useMemo(
      () => ({
        name: taskQuery.data?.data?.name || null,
        description: taskQuery.data?.data?.description || null,
      }),
      [taskQuery.data?.data?.name, taskQuery.data?.data?.description]
    ),
  });

  // Populate form when task data loads
  React.useEffect(() => {
    if (taskQuery.data?.data && !isEditing) {
      editForm.reset({
        name: taskQuery.data.data.name || null,
        description: taskQuery.data.data.description || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskQuery.data?.data?.task_id, isEditing]);

  // Extract ETag for mutations (must be before useTaskUpdateFormSubmit)
  const etag = useMemo(() => {
    return extractETagFromUpdatedAt(taskQuery.data?.data) || undefined;
  }, [taskQuery.data?.data]);

  const { submit: submitEdit, isLoading: isSavingEdit } = useTaskUpdateFormSubmit({
    form: editForm,
    taskId,
    etag,
  });

  // Get task-specific permissions
  const taskPermissions = useTaskPermissions({
    userRole,
    task: taskQuery.data?.data || null,
  });

  // Transform task data
  const transformedTask = useMemo(() => {
    if (!taskQuery.data?.data) return null;
    return transformTaskDetail(taskQuery.data.data);
  }, [taskQuery.data?.data]);

  // Determine permissions from task data (R14: memoized to prevent recalculation) - MUST be before early returns
  const canEdit = useMemo(
    () => taskPermissions.canUpdateTask && transformedTask?.isTerminal === false,
    [taskPermissions.canUpdateTask, transformedTask?.isTerminal]
  );
  const canChangeStatus = useMemo(
    () => taskPermissions.canChangeStatus && transformedTask?.isTerminal === false,
    [taskPermissions.canChangeStatus, transformedTask?.isTerminal]
  );
  const canManageAssignments = useMemo(
    () => taskPermissions.canManageAssignments,
    [taskPermissions.canManageAssignments]
  );
  const canDelete = useMemo(
    () => taskPermissions.canDeleteTask,
    [taskPermissions.canDeleteTask]
  );

  // Memoized assignments array to prevent unnecessary re-renders (R14) - MUST be before early returns
  const existingAssignments = useMemo(() => {
    return taskQuery.data?.data?.assignments || [];
  }, [taskQuery.data?.data?.assignments]);

  // All event handlers - MUST be before early returns
  const handleEdit = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSaveEdit = useCallback(async (values: Parameters<typeof submitEdit>[0]) => {
    try {
      await submitEdit(values);
      setIsEditing(false);
    } catch (error) {
      // Error handling is done by submit hook
    }
  }, [submitEdit]);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    // Reset form to original values
    editForm.reset({
      name: taskQuery.data?.data?.name || null,
      description: taskQuery.data?.data?.description || null,
    });
  }, [editForm, taskQuery.data?.data?.name, taskQuery.data?.data?.description]);

  // Handle status change request (opens modal)
  const handleStatusChange = useCallback(
    (status: TaskStatus) => {
      setPendingStatus(status);
      setShowStatusChangeModal(true);
    },
    []
  );

  // Handle confirmed status change
  const handleConfirmStatusChange = useCallback(
    async () => {
      if (!taskId || !etag || !pendingStatus) return;

      try {
        await updateMutation.mutateAsync({
          task_id: taskId,
          payload: { status: pendingStatus },
          etag,
        });
        showSuccess(`Task status changed to ${getTaskStatusLabel(pendingStatus)}`);
        setShowStatusChangeModal(false);
        setPendingStatus(null);
      } catch (error) {
        showError("Failed to change task status. Please try again.");
        setShowStatusChangeModal(false);
        setPendingStatus(null);
      }
    },
    [taskId, etag, pendingStatus, updateMutation, showSuccess, showError]
  );

  // Handle assignment management
  const handleManageAssignments = useCallback(() => {
    setShowAssignmentModal(true);
  }, []);

  const handleSaveAssignments = useCallback(
    async (add: TaskAssignmentAdd[], remove: TaskAssignmentRemove[]) => {
      if (!taskId || !etag) return;

      // Validate that at least one operation is provided
      if (add.length === 0 && remove.length === 0) {
        showError("No changes to save");
        return;
      }

      try {
        await updateMutation.mutateAsync({
          task_id: taskId,
          payload: {
            assignments: {
              add: add.length > 0 ? add : undefined,
              remove: remove.length > 0 ? remove : undefined,
            },
          },
          etag,
        });
        showSuccess("Task assignments updated successfully");
        setShowAssignmentModal(false);
      } catch (error) {
        showError("Failed to update task assignments. Please try again.");
      }
    },
    [taskId, etag, updateMutation, showSuccess, showError]
  );

  // Handle delete
  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!taskId || !etag) return;

    try {
      await deleteMutation.mutateAsync({
        task_id: taskId,
        etag,
      });
      showSuccess("Task deleted successfully");
      // Navigate to list on success
      router.push("/company/tasks");
    } catch (error) {
      showError("Failed to delete task. Please try again.");
      setShowDeleteModal(false);
    }
  }, [taskId, etag, deleteMutation, router, showSuccess, showError]);

  // Memoized modal close handlers (R14: avoid inline functions) - MUST be before early returns
  const handleCloseDeleteModal = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleCloseAssignmentModal = useCallback(() => {
    setShowAssignmentModal(false);
  }, []);

  const handleCloseStatusChangeModal = useCallback(() => {
    setShowStatusChangeModal(false);
    setPendingStatus(null);
  }, []);

  // Loading state (AFTER all hooks)
  if (taskQuery.isLoading) {
    return <Loader message="Loading task details..." />;
  }

  // Error state (AFTER all hooks)
  if (taskQuery.isError) {
    return (
      <ErrorState
        message={taskQuery.error?.message || "Failed to load task"}
        onRetry={taskQuery.refetch}
      />
    );
  }

  // No data (AFTER all hooks)
  if (!taskQuery.data?.data || !transformedTask) {
    return (
      <ErrorState
        message="Task not found"
        onRetry={() => router.push("/company/tasks")}
      />
    );
  }

  return (
    <>
      <TaskDetail
        task={transformedTask}
        canEdit={canEdit}
        canChangeStatus={canChangeStatus}
        canManageAssignments={canManageAssignments}
        canDelete={canDelete}
        isTerminal={transformedTask.isTerminal}
        isEditing={isEditing}
        editForm={isEditing ? editForm : undefined}
        onEdit={handleEdit}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onStatusChange={handleStatusChange}
        onManageAssignments={handleManageAssignments}
        onDelete={handleDelete}
        isDeleting={deleteMutation.isPending}
        isUpdatingStatus={updateMutation.isPending}
        isSavingEdit={isSavingEdit}
      />

      {/* Delete Confirmation Modal */}
      <TaskDeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        taskName={transformedTask.name}
        isLoading={deleteMutation.isPending}
      />

      {/* Assignment Management Modal */}
      <TaskAssignmentModal
        isOpen={showAssignmentModal}
        onClose={handleCloseAssignmentModal}
        onSave={handleSaveAssignments}
        existingAssignments={existingAssignments}
        isLoading={updateMutation.isPending}
      />

      {/* Status Change Confirmation Modal */}
      {pendingStatus && (
        <TaskStatusChangeModal
          isOpen={showStatusChangeModal}
          onClose={handleCloseStatusChangeModal}
          onConfirm={handleConfirmStatusChange}
          currentStatus={transformedTask.status}
          newStatus={pendingStatus}
          taskName={transformedTask.name}
          isLoading={updateMutation.isPending}
        />
      )}
    </>
  );
}


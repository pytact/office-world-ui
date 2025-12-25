// Task Content Component
// Screen UI component - R16 Layer 3
// Content section for task detail view

"use client";

import React, { useMemo } from "react";
import { UseFormReturn, Controller } from "react-hook-form";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedTaskDetail } from "@/hooks/useTaskTransformations";
import type { TaskUpdateFormSchema } from "@/modules/tasks/forms/task.schema";

interface TaskContentProps {
  task: TransformedTaskDetail;
  isEditing?: boolean;
  editForm?: UseFormReturn<TaskUpdateFormSchema>;
  onSave?: (values: TaskUpdateFormSchema) => void | Promise<void>;
  onCancel?: () => void;
  isSaving?: boolean;
}

/**
 * Task Content Component
 * Content section showing task description and project info
 * Following R17: Secondary content area
 */
export const TaskContent = React.memo(function TaskContent({
  task,
  isEditing = false,
  editForm,
  onSave,
  onCancel,
  isSaving = false,
}: TaskContentProps) {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
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

  const descriptionStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.body,
      whiteSpace: "pre-wrap" as const,
    } as const),
    []
  );

  const emptyDescriptionStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      fontStyle: "italic" as const,
    } as const),
    []
  );

  const characterCountStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      marginTop: spacing[2],
    } as const),
    []
  );

  const errorMessageStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: "8px",
      marginTop: spacing[3],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex" as const,
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[4],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* Description Section */}
      <Card variant="default" padding="lg">
        <h2 style={sectionTitleStyle}>Description</h2>
        {isEditing && editForm ? (
          <form onSubmit={editForm.handleSubmit(onSave!)}>
            <Controller
              name="description"
              control={editForm.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder="Enter task description..."
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    maxLength={5000}
                    rows={6}
                  />
                  <div style={characterCountStyle}>
                    {(field.value || "").length} / 5000 characters
                  </div>
                </>
              )}
            />
            {editForm.formState.errors.root && (
              <div style={errorMessageStyle}>
                {editForm.formState.errors.root.message}
              </div>
            )}
            <div style={buttonGroupStyle}>
              <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={isSaving} disabled={isSaving}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div style={task.description ? descriptionStyle : emptyDescriptionStyle}>
            {task.description || "No description provided"}
          </div>
        )}
      </Card>
    </div>
  );
});


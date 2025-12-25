// Task Create Form Component
// Screen UI component - R16 Layer 3
// Pure UI form component following R10 (React Hook Form)

"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn, Controller } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import type { TaskCreateFormSchema } from "@/modules/tasks/forms/task.schema";
import type { ProjectSummary } from "@/utils/types/responses/project";

interface TaskCreateFormProps {
  form: UseFormReturn<TaskCreateFormSchema>;
  onSubmit: (values: TaskCreateFormSchema) => void | Promise<void>;
  isLoading: boolean;
  projects?: ProjectSummary[];
  onCancel?: () => void;
}

/**
 * Task Create Form Component
 * Form UI for creating a new task
 * Following R10: React Hook Form with Zod validation
 * Following R17: Primary action (name input), Secondary (create button)
 * Following R14: Memoized for performance
 */
export const TaskCreateForm = React.memo(function TaskCreateForm({
  form,
  onSubmit,
  isLoading,
  projects = [],
  onCancel,
}: TaskCreateFormProps) {
  const router = useRouter();

  // Auto-focus on first error field
  useEffect(() => {
    const firstError = Object.keys(form.formState.errors)[0];
    if (firstError) {
      const element = document.querySelector(`[name="${firstError}"]`) as HTMLElement;
      if (element) {
        element.focus();
      }
    }
  }, [form.formState.errors]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      router.push("/company/tasks");
    }
  }, [onCancel, router]);

  const formStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[6],
    } as const),
    []
  );

  const fieldGroupStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const helperTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      marginTop: spacing[1],
    } as const),
    []
  );

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[4],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      margin: 0,
    } as const),
    []
  );

  const errorStyle = useMemo(
    () => ({
      padding: spacing[4],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: borderRadius.md,
      marginBottom: spacing[4],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  // Project options for select (R14: memoized to prevent recalculation)
  const projectOptions = useMemo(() => {
    const options = [{ value: "", label: "No Project (Standalone)" }];
    // Filter active projects (memoized computation)
    const activeProjects = projects.filter((p) => p.status === "ACTIVE");
    // Map to options format
    activeProjects.forEach((project) => {
      options.push({ value: project.id, label: project.name });
    });
    return options;
  }, [projects]);

  // Character count helpers
  const nameValue = form.watch("name") || "";
  const descriptionValue = form.watch("description") || "";

  const containerWrapperStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  return (
    <div style={containerWrapperStyle}>
      <Card variant="default" padding="lg">
        <h1 style={titleStyle}>Create New Task</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} style={formStyle}>
          {/* Root Error Display */}
          {form.formState.errors.root && (
            <div style={errorStyle}>
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Task Name - Primary Field (R17: Primary action) */}
          <div style={fieldGroupStyle}>
            <label htmlFor="task-name" style={labelStyle}>
              Task Name *
            </label>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="task-name"
                    type="text"
                    placeholder="Enter task name"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    autoFocus
                    maxLength={255}
                  />
                  <div style={helperTextStyle}>
                    {nameValue.length} / 255 characters
                  </div>
                </>
              )}
            />
          </div>

          {/* Description - Secondary Field */}
          <div style={fieldGroupStyle}>
            <label htmlFor="task-description" style={labelStyle}>
              Description
            </label>
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    id="task-description"
                    placeholder="Enter task description (optional)"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    maxLength={5000}
                    rows={6}
                    value={field.value || ""}
                  />
                  <div style={helperTextStyle}>
                    {(descriptionValue || "").length} / 5000 characters
                  </div>
                </>
              )}
            />
          </div>

          {/* Project Selector - Optional Field (Tertiary) */}
          {projects.length > 0 && (
            <div style={fieldGroupStyle}>
              <label htmlFor="task-project" style={labelStyle}>
                Project (Optional)
              </label>
              <Controller
                name="project_id"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      {...field}
                      id="task-project"
                      value={field.value || ""}
                      onChange={(e) => {
                        field.onChange(e.target.value || null);
                      }}
                      options={projectOptions}
                    />
                    <div style={helperTextStyle}>
                      Link this task to a project (optional)
                    </div>
                  </>
                )}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div style={buttonGroupStyle}>
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} disabled={isLoading}>
              Create Task
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});

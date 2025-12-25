// Project Create Form Component
// Screen UI component - R16 Layer 3
// Pure UI form component following R10 (React Hook Form)

"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn, Controller } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { Card } from "@/components/ui/Card";
import { ProjectStatusSelector } from "./ProjectStatusSelector";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import type { ProjectCreateFormSchema } from "@/modules/projects/forms/project.schema";
import { projectRoutes } from "@/utils/routes/project.routes";

interface ProjectCreateFormProps {
  form: UseFormReturn<ProjectCreateFormSchema>;
  onSubmit: (values: ProjectCreateFormSchema) => void | Promise<void>;
  isLoading: boolean;
  onCancel?: () => void;
}

/**
 * Project Create Form Component
 * Form UI for creating a new project
 * Following R10: React Hook Form with Zod validation
 * Following R17: Primary action (name input), Secondary (status, create button)
 * Following R14: Memoized for performance
 */
export const ProjectCreateForm = React.memo(function ProjectCreateForm({
  form,
  onSubmit,
  isLoading,
  onCancel,
}: ProjectCreateFormProps) {
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
      router.push(projectRoutes.company.list);
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

  return (
    <Card variant="default" padding="lg">
      <h1 style={titleStyle}>Create New Project</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} style={formStyle}>
        {/* Root Error Display */}
        {form.formState.errors.root && (
          <div style={errorStyle}>
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Project Name - Primary Field */}
        <div style={fieldGroupStyle}>
          <label htmlFor="project-name" style={labelStyle}>
            Project Name *
          </label>
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                id="project-name"
                type="text"
                placeholder="Enter project name"
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                autoFocus
              />
            )}
          />
        </div>

        {/* Status - Secondary Field */}
        <div style={fieldGroupStyle}>
          <label htmlFor="project-status" style={labelStyle}>
            Status *
          </label>
          <Controller
            name="status"
            control={form.control}
            render={({ field, fieldState }) => (
              <ProjectStatusSelector
                value={field.value}
                onChange={field.onChange}
                error={!!fieldState.error}
                errorMessage={fieldState.error?.message}
                disabled={isLoading}
              />
            )}
          />
        </div>

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
            Create Project
          </Button>
        </div>
      </form>
    </Card>
  );
});


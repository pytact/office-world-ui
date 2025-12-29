// Leave Create Form Component
// Screen UI component - R16 Layer 3
// Pure UI form component following R10 (React Hook Form)
// Following R17: Creation Screen with clear visual hierarchy

"use client";

import React, { useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UseFormReturn, Controller } from "react-hook-form";
import { Button, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import type { LeaveCreateFormSchema } from "@/modules/leaves/forms/leave.schema";
import type { EmployeeSummary } from "@/utils/types/responses/employee";
import { leaveRoutes } from "@/utils/routes";

interface LeaveCreateFormProps {
  form: UseFormReturn<LeaveCreateFormSchema>;
  onSubmit: (values: LeaveCreateFormSchema) => void | Promise<void>;
  isLoading: boolean;
  managerOptions?: Array<{ value: string; label: string }>;
  hrOptions?: Array<{ value: string; label: string }>;
  calculatedDays?: number;
  onCancel?: () => void;
  userRole?: "superadmin" | "ceo" | "manager" | "hr" | "employee" | null;
  employeeId?: string | null; // For HR to auto-fill hr_approver_id
}

const LEAVE_TYPE_OPTIONS = [
  { value: "CASUAL", label: "Casual Leave" },
  { value: "SICK", label: "Sick Leave" },
  { value: "PAID", label: "Paid Leave" },
  { value: "UNPAID", label: "Unpaid Leave" },
] as const;

const DAY_TYPE_OPTIONS = [
  { value: "FULL_DAY", label: "Full Day" },
  { value: "FIRST_HALF", label: "First Half" },
  { value: "SECOND_HALF", label: "Second Half" },
] as const;

/**
 * Leave Create Form Component
 * Form UI for creating a new leave request
 * Following R10: React Hook Form with Zod validation
 * Following R17: Primary action (leave type), Secondary (submit button)
 * Following R14: Memoized for performance
 */
export const LeaveCreateForm = React.memo(function LeaveCreateForm({
  form,
  onSubmit,
  isLoading,
  managerOptions = [],
  hrOptions = [],
  calculatedDays,
  onCancel,
  userRole,
  employeeId,
}: LeaveCreateFormProps) {
  const router = useRouter();

  // For HR: Auto-fill approver IDs when form loads
  useEffect(() => {
    if (userRole === "hr" && employeeId) {
      // Auto-fill hr_approver_id with HR's own employee_id
      if (!form.getValues("hr_approver_id")) {
        form.setValue("hr_approver_id", employeeId);
      }
      
      // Auto-fill manager_approver_id with first available manager if available
      if (managerOptions.length > 0 && !form.getValues("manager_approver_id")) {
        form.setValue("manager_approver_id", managerOptions[0].value);
      }
    }
  }, [userRole, employeeId, managerOptions, form]);

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
      router.push(leaveRoutes.company.list);
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

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: spacing[4],
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

  const requiredLabelStyle = useMemo(
    () => ({
      color: colors.error,
      marginLeft: spacing[1],
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

  const calculatedDaysStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  // Character count helpers
  const reasonValue = form.watch("reason") || "";

  const containerWrapperStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // Manager and HR options with placeholder
  const managerSelectOptions = useMemo(() => {
    return [
      { value: "", label: "Select Manager Approver" },
      ...managerOptions,
    ];
  }, [managerOptions]);

  const hrSelectOptions = useMemo(() => {
    return [
      { value: "", label: "Select HR Approver" },
      ...hrOptions,
    ];
  }, [hrOptions]);

  // Memoized onChange handlers for Select components (R14: Performance)
  // These are factory functions that return handlers bound to specific fields
  const createLeaveTypeHandler = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      field.onChange(e.target.value as "CASUAL" | "SICK" | "PAID" | "UNPAID");
    },
    []
  );

  const createDayTypeHandler = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      field.onChange(e.target.value as "FULL_DAY" | "FIRST_HALF" | "SECOND_HALF");
    },
    []
  );

  const createManagerApproverHandler = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      field.onChange(e.target.value || "");
    },
    []
  );

  const createHrApproverHandler = useCallback(
    (field: any) => (e: React.ChangeEvent<HTMLSelectElement>) => {
      field.onChange(e.target.value || "");
    },
    []
  );

  return (
    <div style={containerWrapperStyle}>
      <Card variant="default" padding="lg">
        <h1 style={titleStyle}>Create Leave Request</h1>

        <form onSubmit={form.handleSubmit(onSubmit)} style={formStyle}>
          {/* Root Error Display */}
          {form.formState.errors.root && (
            <div style={errorStyle}>
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Leave Type - Primary Field (R17: Primary action) */}
          <div style={fieldGroupStyle}>
            <label htmlFor="leave-type" style={labelStyle}>
              Leave Type <span style={requiredLabelStyle}>*</span>
            </label>
            <Controller
              name="leave_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    id="leave-type"
                    value={field.value}
                    onChange={createLeaveTypeHandler(field)}
                    options={LEAVE_TYPE_OPTIONS as unknown as Array<{ value: string; label: string }>}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                </>
              )}
            />
          </div>

          {/* Date Range - Secondary Fields */}
          <div style={gridStyle}>
            <div style={fieldGroupStyle}>
              <label htmlFor="start-date" style={labelStyle}>
                Start Date <span style={requiredLabelStyle}>*</span>
              </label>
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="start-date"
                      type="date"
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    />
                  </>
                )}
              />
            </div>
            <div style={fieldGroupStyle}>
              <label htmlFor="end-date" style={labelStyle}>
                End Date <span style={requiredLabelStyle}>*</span>
              </label>
              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <>
                    <Input
                      {...field}
                      id="end-date"
                      type="date"
                      error={!!fieldState.error}
                      errorMessage={fieldState.error?.message}
                    />
                    
                  </>
                )}
              />
            </div>
          </div>

          {/* Calculated Number of Days - Read-only Display */}
          {calculatedDays !== undefined && (
            <div style={calculatedDaysStyle}>
              Calculated Duration: {calculatedDays === 0.5 ? "0.5 day" : calculatedDays === 1 ? "1 day" : `${calculatedDays} days`}
            </div>
          )}

          {/* Day Type - Secondary Field */}
          <div style={fieldGroupStyle}>
            <label htmlFor="day-type" style={labelStyle}>
              Day Type <span style={requiredLabelStyle}>*</span>
            </label>
            <Controller
              name="day_type"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Select
                    {...field}
                    id="day-type"
                    value={field.value}
                    onChange={createDayTypeHandler(field)}
                    options={DAY_TYPE_OPTIONS as unknown as Array<{ value: string; label: string }>}
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                  />
                  <div style={helperTextStyle}>
                    Select whether this is a full day or half day leave
                  </div>
                </>
              )}
            />
          </div>

          {/* Reason - Secondary Field */}
          <div style={fieldGroupStyle}>
            <label htmlFor="reason" style={labelStyle}>
              Reason <span style={requiredLabelStyle}>*</span>
            </label>
            <Controller
              name="reason"
              control={form.control}
              render={({ field, fieldState }) => (
                <>
                  <Textarea
                    {...field}
                    id="reason"
                    placeholder="Enter reason for leave (10-500 characters)"
                    error={!!fieldState.error}
                    errorMessage={fieldState.error?.message}
                    maxLength={500}
                    rows={4}
                    value={field.value || ""}
                  />
                  <div style={helperTextStyle}>
                    {reasonValue.length} / 500 characters (minimum 10)
                  </div>
                </>
              )}
            />
          </div>

          {/* Approvers - Secondary Fields */}
          {/* Hide approver dropdowns for HR role */}
          {userRole !== "hr" && (
            <div style={gridStyle}>
              <div style={fieldGroupStyle}>
                <label htmlFor="manager-approver" style={labelStyle}>
                  Manager Approver <span style={requiredLabelStyle}>*</span>
                </label>
                <Controller
                  name="manager_approver_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        id="manager-approver"
                        value={field.value || ""}
                        onChange={createManagerApproverHandler(field)}
                        options={managerSelectOptions}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </>
                  )}
                />
              </div>
              <div style={fieldGroupStyle}>
                <label htmlFor="hr-approver" style={labelStyle}>
                  HR Approver <span style={requiredLabelStyle}>*</span>
                </label>
                <Controller
                  name="hr_approver_id"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        id="hr-approver"
                        value={field.value || ""}
                        onChange={createHrApproverHandler(field)}
                        options={hrSelectOptions}
                        error={!!fieldState.error}
                        errorMessage={fieldState.error?.message}
                      />
                    </>
                  )}
                />
              </div>
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
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
});


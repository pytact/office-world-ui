// Leave Rejection Modal Component
// Feature-specific component - R16 Layer 2
// Modal for rejecting leave with mandatory reason
// Following R17: Creation Screen (input rejection reason)

"use client";

import React, { useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input } from "@/components/ui";
import { Textarea } from "@/components/ui/Textarea";
import { spacing, typography, colors } from "@/theme/tokens";
import { UseFormReturn, Controller } from "react-hook-form";
import type { LeaveRejectionFormSchema } from "@/modules/leaves/forms/leave.schema";

interface LeaveRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<LeaveRejectionFormSchema>;
  onSubmit: (values: LeaveRejectionFormSchema) => void | Promise<void>;
  isLoading: boolean;
}

/**
 * Leave Rejection Modal
 * Captures mandatory rejection reason
 * Following R17: Primary action (rejection reason textarea), Secondary (submit button)
 */
export const LeaveRejectionModal = React.memo(function LeaveRejectionModal({
  isOpen,
  onClose,
  form,
  onSubmit,
  isLoading,
}: LeaveRejectionModalProps) {
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await form.handleSubmit(onSubmit)();
    },
    [form, onSubmit]
  );

  const fieldGroupStyle = {
    display: "flex",
    flexDirection: "column" as const,
    gap: spacing[2],
    marginBottom: spacing[4],
  };

  const labelStyle = {
    fontSize: typography.fontSize.body,
    fontWeight: typography.fontWeight.medium,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
  };

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[6],
    } as const),
    []
  );

  const requiredLabelStyle = useMemo(
    () => ({
      color: colors.error,
    } as const),
    []
  );

  const helperTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      marginTop: spacing[1],
    } as const),
    []
  );

  const errorStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: "8px",
      marginBottom: spacing[4],
      fontSize: typography.fontSize.small,
    } as const),
    []
  );

  const reasonValue = form.watch("rejection_reason") || "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reject Leave Request">
      <form onSubmit={handleSubmit}>
        <div style={fieldGroupStyle}>
          <label htmlFor="rejection-reason" style={labelStyle}>
            Rejection Reason <span style={requiredLabelStyle}>*</span>
          </label>
          <Controller
            name="rejection_reason"
            control={form.control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  {...field}
                  id="rejection-reason"
                  placeholder="Enter reason for rejection (10-500 characters)"
                  error={!!fieldState.error}
                  errorMessage={fieldState.error?.message}
                  maxLength={500}
                  rows={4}
                  value={field.value || ""}
                  autoFocus
                />
                <div style={helperTextStyle}>
                  {reasonValue.length} / 500 characters (minimum 10)
                </div>
              </>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <div style={errorStyle}>
            {form.formState.errors.root.message}
          </div>
        )}

        <div style={buttonGroupStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading} disabled={isLoading}>
            Reject Leave
          </Button>
        </div>
      </form>
    </Modal>
  );
});


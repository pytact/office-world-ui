// Leave Rejection Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useLeaveAction } from "@/hooks/useLeaves";
import { useToast } from "@/context/ToastContext";
import { LeaveRejectionFormSchema } from "./leave.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

interface UseLeaveRejectionFormSubmitParams {
  leaveId: string;
  etag?: string;
  onSuccess?: () => void;
}

/**
 * Hook for handling leave rejection form submission
 * Maps API errors to form field errors
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useLeaveRejectionFormSubmit(
  form: UseFormReturn<LeaveRejectionFormSchema>,
  params: UseLeaveRejectionFormSubmitParams
) {
  const actionMutation = useLeaveAction();
  const { showSuccess, showError } = useToast();
  const { leaveId, etag, onSuccess } = params;

  const submit = async (values: LeaveRejectionFormSchema) => {
    if (!leaveId || !etag) {
      form.setError("root", {
        type: "server",
        message: "Leave ID or ETag is missing. Please refresh the page.",
      });
      return;
    }

    try {
      // Build payload matching API spec
      const payload = {
        action: "reject" as const,
        rejection_reason: values.rejection_reason.trim(),
      };

      await actionMutation.mutateAsync({
        leave_id: leaveId,
        payload,
        etag,
      });

      // Show success message
      showSuccess("Leave request rejected successfully");

      // Call onSuccess callback (e.g., close modal, refetch data)
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      // Show general error toast
      showError(normalizedError.message || "Failed to reject leave request");

      // Map field-specific errors
      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof LeaveRejectionFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to reject leave request",
        });
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: actionMutation.isPending,
  };
}


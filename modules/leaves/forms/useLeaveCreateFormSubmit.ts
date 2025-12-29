// Leave Create Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateLeave } from "@/hooks/useLeaves";
import { useToast } from "@/context/ToastContext";
import { LeaveCreateFormSchema } from "./leave.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { leaveRoutes } from "@/utils/routes";
import { filterWeekendsFromDateRange } from "@/utils/helpers/date";

/**
 * Hook for handling leave creation form submission
 * Maps API errors to form field errors
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useLeaveCreateFormSubmit(
  form: UseFormReturn<LeaveCreateFormSchema>
) {
  const router = useRouter();
  const createMutation = useCreateLeave();
  const { showSuccess, showError } = useToast();

  const submit = async (values: LeaveCreateFormSchema) => {
    try {
      // Filter out weekends from date range
      // This adjusts start_date and end_date to exclude Saturday and Sunday
      const { start_date, end_date } = filterWeekendsFromDateRange(
        values.start_date.trim(),
        values.end_date.trim()
      );

      // Build payload matching API spec
      const payload = {
        leave_type: values.leave_type,
        start_date, // Adjusted to exclude weekends
        end_date, // Adjusted to exclude weekends
        day_type: values.day_type,
        reason: values.reason.trim(),
        manager_approver_id: values.manager_approver_id.trim(),
        hr_approver_id: values.hr_approver_id.trim(),
      };

      const response = await createMutation.mutateAsync(payload);

      // Show success message
      showSuccess("Leave request submitted successfully");

      // Navigate to leave detail on success
      if (response?.data?.id) {
        router.push(leaveRoutes.company.detail(response.data.id));
      } else {
        router.push(leaveRoutes.company.list);
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      // Show general error toast
      showError(normalizedError.message || "Failed to submit leave request");

      // Map field-specific errors
      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof LeaveCreateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to submit leave request",
        });
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: createMutation.isPending,
  };
}


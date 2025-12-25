// Salary Form Submit Hook
// Handles form submission and error mapping
// Following R10 rules

import { UseFormReturn } from "react-hook-form";
import { useCreateSalary, useReviseSalary } from "@/hooks/useSalary";
import { useToast } from "@/context/ToastContext";
import { SalaryCreateFormSchema, SalaryReviseFormSchema } from "./salary.schema";
import { SalaryCreate, SalaryRevise } from "@/utils/types/requests/salary";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import type { SalaryDetailsResponse } from "@/utils/types/responses/salary";

interface UseSalaryFormSubmitParams {
  form: UseFormReturn<SalaryCreateFormSchema | SalaryReviseFormSchema>;
  employeeId: string;
  isRevise?: boolean; // true for revise, false for create
  currentSalary?: SalaryDetailsResponse | null; // For ETag extraction
}

/**
 * Hook for handling salary form submission
 * Maps form values to API request, handles errors, and provides success feedback
 */
export function useSalaryFormSubmit({
  form,
  employeeId,
  isRevise = false,
  currentSalary,
}: UseSalaryFormSubmitParams) {
  const { showSuccess, showError } = useToast();
  const createMutation = useCreateSalary();
  const reviseMutation = useReviseSalary();

  const submit = async (
    values: SalaryCreateFormSchema | SalaryReviseFormSchema
  ) => {
    try {
      // Extract ETag for revise operations
      const etag = isRevise && currentSalary
        ? extractETagFromUpdatedAt(currentSalary) || undefined
        : undefined;

      // Map form values to API request format
      const payload: SalaryCreate | SalaryRevise = {
        amount: values.amount,
        currency: values.currency,
        payment_frequency: values.payment_frequency,
        effective_from: values.effective_from,
        effective_to: values.effective_to || null,
      };

      if (isRevise) {
        await reviseMutation.mutateAsync({
          employee_id: employeeId,
          payload: payload as SalaryRevise,
          etag,
        });
        showSuccess("Salary updated successfully. Previous period closed.");
      } else {
        await createMutation.mutateAsync({
          employee_id: employeeId,
          payload: payload as SalaryCreate,
        });
        showSuccess("Salary created successfully");
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof (SalaryCreateFormSchema | SalaryReviseFormSchema), {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (
        !normalizedError.fieldErrors ||
        Object.keys(normalizedError.fieldErrors).length === 0
      ) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to save salary",
        });
        showError(normalizedError.message || "Failed to save salary");
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: isRevise ? reviseMutation.isPending : createMutation.isPending,
  };
}


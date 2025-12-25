// Salary Payment Form Submit Hook
// Handles form submission and error mapping
// Following R10 rules

import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { useCreateSalaryPayment } from "@/hooks/useSalaryPayment";
import { useToast } from "@/context/ToastContext";
import { SalaryPaymentCreateFormSchema } from "./salaryPayment.schema";
import { SalaryPaymentCreate } from "@/utils/types/requests/salaryPayment";
import { salaryRoutes } from "@/utils/routes/salary.routes";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

interface UseSalaryPaymentFormSubmitParams {
  form: UseFormReturn<SalaryPaymentCreateFormSchema>;
  employeeId: string;
}

/**
 * Hook for handling salary payment form submission
 * Maps form values to API request, handles errors, and navigates on success
 */
export function useSalaryPaymentFormSubmit({
  form,
  employeeId,
}: UseSalaryPaymentFormSubmitParams) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const createMutation = useCreateSalaryPayment();

  const submit = async (values: SalaryPaymentCreateFormSchema) => {
    try {
      // Map form values to API request format
      const payload: SalaryPaymentCreate = {
        employee_id: employeeId,
        month: values.month,
        year: values.year,
        payment_method: values.payment_method,
      };

      await createMutation.mutateAsync({
        employee_id: employeeId,
        payload,
      });

      // Show success message
      showSuccess(
        "Salary payment recorded successfully. Salary slip will be emailed to employee."
      );

      // Navigate back to salary overview
      router.push(salaryRoutes.company.overview(employeeId));
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof SalaryPaymentCreateFormSchema, {
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
          message: normalizedError.message || "Failed to create salary payment",
        });
        showError(normalizedError.message || "Failed to create salary payment");
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: createMutation.isPending,
  };
}


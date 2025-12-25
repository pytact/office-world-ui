// Bank Info Form Submit Hook
// Handles form submission and error mapping
// Following R10 rules

import { UseFormReturn } from "react-hook-form";
import { useCreateBankInfo, useUpdateBankInfo } from "@/hooks/useBankInfo";
import { useToast } from "@/context/ToastContext";
import { BankInfoFormSchema } from "./bankInfo.schema";
import { BankInfoCreate, BankInfoUpdate } from "@/utils/types/requests/bankInfo";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import type { BankInfoResponse } from "@/utils/types/responses/bankInfo";

interface UseBankInfoFormSubmitParams {
  form: UseFormReturn<BankInfoFormSchema>;
  employeeId: string;
  isUpdate?: boolean; // true for update, false for create
  currentBankInfo?: BankInfoResponse | null; // For ETag extraction
}

/**
 * Hook for handling bank info form submission
 * Maps form values to API request, handles errors, and provides success feedback
 */
export function useBankInfoFormSubmit({
  form,
  employeeId,
  isUpdate = false,
  currentBankInfo,
}: UseBankInfoFormSubmitParams) {
  const { showSuccess, showError } = useToast();
  const createMutation = useCreateBankInfo();
  const updateMutation = useUpdateBankInfo();

  const submit = async (values: BankInfoFormSchema) => {
    try {
      // Extract ETag for update operations
      const etag = isUpdate && currentBankInfo
        ? extractETagFromUpdatedAt(currentBankInfo) || undefined
        : undefined;

      // Map form values to API request format
      const payload: BankInfoCreate | BankInfoUpdate = {
        bank_name: values.bank_name,
        branch: values.branch,
        account_number: values.account_number.toUpperCase(), // Ensure uppercase
        ifsc_code: values.ifsc_code.toUpperCase(), // Ensure uppercase
      };

      if (isUpdate) {
        await updateMutation.mutateAsync({
          employee_id: employeeId,
          payload: payload as BankInfoUpdate,
          etag,
        });
        showSuccess("Bank information updated successfully");
      } else {
        await createMutation.mutateAsync({
          employee_id: employeeId,
          payload: payload as BankInfoCreate,
        });
        showSuccess("Bank information created successfully");
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof BankInfoFormSchema, {
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
          message: normalizedError.message || "Failed to save bank information",
        });
        showError(normalizedError.message || "Failed to save bank information");
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: isUpdate ? updateMutation.isPending : createMutation.isPending,
  };
}


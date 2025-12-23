// Employee Update Form Submit Hook
// Handles form submission and API error mapping
// Following R10 rules

import { UseFormReturn } from "react-hook-form";
import { useUpdateEmployee } from "@/hooks/useEmployees";
import { useToast } from "@/context/ToastContext";
import { EmployeeUpdateFormSchema } from "./employee.schema";
import { EmployeeUpdate } from "@/utils/types/requests/employee";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

interface UseEmployeeUpdateFormSubmitParams {
  form: UseFormReturn<EmployeeUpdateFormSchema>;
  employee_id: string;
  etag?: string | null;
  onSuccess?: () => void;
}

/**
 * Hook for handling employee update form submission
 * Maps form values to API request, handles errors, and manages ETag
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useEmployeeUpdateFormSubmit({
  form,
  employee_id,
  etag,
  onSuccess,
}: UseEmployeeUpdateFormSubmitParams) {
  const { showSuccess, showError } = useToast();
  const updateMutation = useUpdateEmployee();

  const submit = async (values: EmployeeUpdateFormSchema) => {
    try {
      // Build payload - only include fields that have values or are explicitly set
      const payload: EmployeeUpdate = {};

      // Map form values to API request format
      if (values.employment_status !== undefined && values.employment_status !== null) {
        payload.employment_status = values.employment_status;
      }
      if (values.job_title !== undefined) {
        payload.job_title = values.job_title || null;
      }
      if (values.department !== undefined) {
        payload.department = values.department || null;
      }
      if (values.employment_type !== undefined) {
        payload.employment_type = values.employment_type || null;
      }
      if (values.employment_level !== undefined) {
        payload.employment_level = values.employment_level || null;
      }
      if (values.work_email !== undefined) {
        payload.work_email = values.work_email || null;
      }
      if (values.gender !== undefined) {
        payload.gender = values.gender || null;
      }
      if (values.marital_status !== undefined) {
        payload.marital_status = values.marital_status || null;
      }
      if (values.blood_group !== undefined) {
        payload.blood_group = values.blood_group || null;
      }
      if (values.nationality !== undefined) {
        payload.nationality = values.nationality || null;
      }
      if (values.address !== undefined) {
        payload.address = values.address || null;
      }
      if (values.city !== undefined) {
        payload.city = values.city || null;
      }
      if (values.state !== undefined) {
        payload.state = values.state || null;
      }
      if (values.country !== undefined) {
        payload.country = values.country || null;
      }
      if (values.document_type !== undefined) {
        payload.document_type = values.document_type || null;
      }
      if (values.document_number !== undefined) {
        payload.document_number = values.document_number || null;
      }
      if (values.separation_initiated_date !== undefined) {
        payload.separation_initiated_date = values.separation_initiated_date || null;
      }
      if (values.separation_reason !== undefined) {
        payload.separation_reason = values.separation_reason || null;
      }
      if (values.last_working_day !== undefined) {
        payload.last_working_day = values.last_working_day || null;
      }
      if (values.notice_period_days !== undefined) {
        payload.notice_period_days = values.notice_period_days || null;
      }
      if (values.is_active !== undefined && values.is_active !== null) {
        payload.is_active = values.is_active;
      }

      await updateMutation.mutateAsync({
        employee_id,
        payload,
        etag: etag || undefined,
      });

      // Show success message
      showSuccess("Employee updated successfully");

      // Call optional success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof EmployeeUpdateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to update employee",
        });
        showError(normalizedError.message || "Failed to update employee");
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: updateMutation.isPending,
  };
}


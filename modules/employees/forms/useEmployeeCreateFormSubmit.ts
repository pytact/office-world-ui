// Employee Create Form Submit Hook
// Handles form submission and navigation
// Following R10 rules

import { useRouter } from "next/navigation";
import { UseFormReturn } from "react-hook-form";
import { useCreateEmployee } from "@/hooks/useEmployees";
import { useToast } from "@/context/ToastContext";
import { EmployeeCreateFormSchema } from "./employee.schema";
import { EmployeeCreate } from "@/utils/types/requests/employee";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

interface UseEmployeeCreateFormSubmitParams {
  form: UseFormReturn<EmployeeCreateFormSchema>;
}

/**
 * Hook for handling employee creation form submission
 * Maps form values to API request, handles errors, and navigates on success
 */
export function useEmployeeCreateFormSubmit({
  form,
}: UseEmployeeCreateFormSubmitParams) {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const createMutation = useCreateEmployee();

  const submit = async (values: EmployeeCreateFormSchema) => {
    try {
      // Map form values to API request format
      const payload: EmployeeCreate = {
        user_id: values.user_id,
        joining_date: values.joining_date,
        employment_status: values.employment_status,
        job_title: values.job_title || null,
        department: values.department || null,
        employment_type: values.employment_type || null,
        employment_level: values.employment_level || null,
        work_email: values.work_email || null,
        gender: values.gender || null,
        marital_status: values.marital_status || null,
        blood_group: values.blood_group || null,
        nationality: values.nationality || null,
        address: values.address || null,
        city: values.city || null,
        state: values.state || null,
        country: values.country || null,
        document_type: values.document_type || null,
        document_number: values.document_number || null,
        separation_initiated_date: values.separation_initiated_date || null,
        separation_reason: values.separation_reason || null,
        last_working_day: values.last_working_day || null,
        notice_period_days: values.notice_period_days || null,
      };

      const response = await createMutation.mutateAsync(payload);

      // Show success message
      showSuccess("Employee created successfully");

      // Navigate to employee detail page
      if (response?.data?.employee_id) {
        router.push(employeeRoutes.company.detail(response.data.employee_id));
      } else {
        router.push(employeeRoutes.company.list);
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof EmployeeCreateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to create employee",
        });
        showError(normalizedError.message || "Failed to create employee");
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: createMutation.isPending,
  };
}



// Task Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateTask } from "@/hooks/useTasks";
import { useToast } from "@/context/ToastContext";
import { TaskCreateFormSchema } from "./task.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

/**
 * Hook for handling task creation form submission
 * Maps API errors to form field errors
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useTaskFormSubmit(
  form: UseFormReturn<TaskCreateFormSchema>
) {
  const router = useRouter();
  const createMutation = useCreateTask();
  const { showSuccess, showError } = useToast();

  const submit = async (values: TaskCreateFormSchema) => {
    try {
      // Build payload matching API spec
      // Status is always "TODO" for new tasks (per API spec)
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        status: "TODO" as const, // Always TODO for new tasks
        project_id: values.project_id || undefined,
      };

      const response = await createMutation.mutateAsync(payload);

      // Show success message
      showSuccess("Task created successfully");

      // Navigate to task detail on success
      if (response?.data?.task_id) {
        router.push(`/company/tasks/${response.data.task_id}`);
      } else {
        router.push("/company/tasks");
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      // Show general error toast
      showError(normalizedError.message || "Failed to create task");

      // Map field-specific errors
      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof TaskCreateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to create task",
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


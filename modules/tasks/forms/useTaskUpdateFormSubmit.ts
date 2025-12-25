// Task Update Form Submit Hook
// Handles form submission and API error mapping following R10
// F-008: Task Management & Assignment

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { useUpdateTask } from "@/hooks/useTasks";
import { TaskUpdateFormSchema } from "./task.schema";

interface UseTaskUpdateFormSubmitParams {
  form: UseFormReturn<TaskUpdateFormSchema>;
  taskId: string;
  etag?: string;
}

/**
 * Hook for handling task update form submission
 * Maps API errors to form field errors and shows toasts
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useTaskUpdateFormSubmit(
  params: UseTaskUpdateFormSubmitParams
) {
  const { form, taskId, etag } = params;
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const updateMutation = useUpdateTask();

  const submit = async (values: TaskUpdateFormSchema) => {
    try {
      // Build payload for edit form (partial update)
      const payload: TaskUpdateFormSchema = {
        name: values.name?.trim() || null,
        description: values.description?.trim() || null,
      };

      // ETag is required for PATCH operations
      if (!etag) {
        showError("ETag is required for updating task. Please refresh the page and try again.");
        return;
      }

      await updateMutation.mutateAsync({
        task_id: taskId,
        payload,
        etag,
      });

      showSuccess("Task updated successfully!");
      // Stay on detail page (no navigation)
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError.message || "An unexpected error occurred.");

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof TaskUpdateFormSchema, {
            type: "server",
            message,
          });
        });
      } else {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to process request.",
        });
      }
      throw error; // Re-throw to allow calling component to handle if needed
    }
  };

  return {
    submit,
    isLoading: updateMutation.isPending,
  };
}


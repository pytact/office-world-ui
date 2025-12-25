// Project Update Form Submit Hook
// Handles form submission and API error mapping following R10
// F-007: Project Management

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/context/ToastContext";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { useUpdateProject } from "@/hooks/useProjects";
import { ProjectUpdateFormSchema } from "./project.schema";
import { projectRoutes } from "@/utils/routes/project.routes";

interface UseProjectUpdateFormSubmitParams {
  form: UseFormReturn<ProjectUpdateFormSchema>;
  projectId: string;
  etag?: string;
}

/**
 * Hook for handling project update form submission
 * Maps API errors to form field errors and shows toasts
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useProjectUpdateFormSubmit(
  params: UseProjectUpdateFormSubmitParams
) {
  const { form, projectId, etag } = params;
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const updateMutation = useUpdateProject();

  const submit = async (values: ProjectUpdateFormSchema) => {
    try {
      // Build payload for edit form (both fields required in form, but API accepts partial)
      const payload: ProjectUpdateFormSchema = {
        name: values.name?.trim() || null,
        status: values.status || null,
      };

      // ETag is required for PATCH operations
      if (!etag) {
        showError("ETag is required for updating project. Please refresh the page and try again.");
        return;
      }

      await updateMutation.mutateAsync({
        project_id: projectId,
        payload,
        etag,
      });

      showSuccess("Project updated successfully!");
      router.push(projectRoutes.company.detail(projectId));
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError.message || "An unexpected error occurred.");

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ProjectUpdateFormSchema, {
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


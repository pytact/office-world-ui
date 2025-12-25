// Project Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useCreateProject } from "@/hooks/useProjects";
import { useToast } from "@/context/ToastContext";
import { ProjectCreateFormSchema } from "./project.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";
import { projectRoutes } from "@/utils/routes/project.routes";

/**
 * Hook for handling project creation form submission
 * Maps API errors to form field errors
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useProjectFormSubmit(
  form: UseFormReturn<ProjectCreateFormSchema>
) {
  const router = useRouter();
  const createMutation = useCreateProject();
  const { showSuccess, showError } = useToast();

  const submit = async (values: ProjectCreateFormSchema) => {
    try {
      // Build payload matching API spec
      const payload = {
        name: values.name.trim(),
        status: values.status,
      };

      const response = await createMutation.mutateAsync(payload);

      // Show success message
      showSuccess("Project created successfully");

      // Navigate to project detail on success
      if (response?.data?.id) {
        router.push(projectRoutes.company.detail(response.data.id));
      } else {
        router.push(projectRoutes.company.list);
      }
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      // Show general error toast
      showError(normalizedError.message || "Failed to create project");

      // Map field-specific errors
      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof ProjectCreateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to create project",
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


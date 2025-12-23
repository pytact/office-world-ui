// User Update Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useUpdateUser } from "@/hooks/useUsers";
import { UserUpdateFormSchema } from "./user.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

/**
 * Hook for handling user update form submission
 * Maps API errors to form field errors
 * Following R10 rules: API error mapping, mutation hooks
 */
export function useUserUpdateFormSubmit(
  form: UseFormReturn<UserUpdateFormSchema>,
  userId: string,
  etag?: string | null
) {
  const updateMutation = useUpdateUser();

  const submit = async (values: UserUpdateFormSchema) => {
    try {
      // Build payload - send actual form values
      const payload: {
        first_name?: string | null;
        last_name?: string | null;
      } = {};

      // Handle first_name: use form value as-is (could be string, null, or empty string)
      if (values.first_name !== undefined) {
        if (typeof values.first_name === "string" && values.first_name.trim() !== "") {
          payload.first_name = values.first_name.trim();
        } else {
          // Empty string or null - send null
          payload.first_name = null;
        }
      }

      // Handle last_name: use form value as-is (could be string, null, or empty string)
      if (values.last_name !== undefined) {
        if (typeof values.last_name === "string" && values.last_name.trim() !== "") {
          payload.last_name = values.last_name.trim();
        } else {
          // Empty string or null - send null
          payload.last_name = null;
        }
      }

      // Validate: at least one field must have a non-null value
      const hasValidValue = 
        (payload.first_name !== null && payload.first_name !== undefined) ||
        (payload.last_name !== null && payload.last_name !== undefined);

      if (!hasValidValue) {
        form.setError("root", {
          type: "validation",
          message: "At least one field (first_name or last_name) must be provided",
        });
        return;
      }

      await updateMutation.mutateAsync({
        user_id: userId,
        payload,
        etag: etag || undefined,
      });
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof UserUpdateFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to update user",
        });
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: updateMutation.isPending,
  };
}


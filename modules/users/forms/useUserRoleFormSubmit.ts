// User Role Form Submit Hook
// Handles role change form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useUserMutations } from "@/hooks/useUserMutations";
import { useRoles } from "@/hooks/useUsers";
import { UserRoleChangeFormSchema } from "./user.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

/**
 * Hook for handling user role change form submission
 * Maps API errors to form field errors
 * @param form - React Hook Form instance
 * @param userId - User ID to update
 * @param etag - ETag from GET response (required for PATCH operations)
 */
export function useUserRoleFormSubmit(
  form: UseFormReturn<UserRoleChangeFormSchema>,
  userId: string,
  etag?: string
) {
  const mutations = useUserMutations();
  const { data: rolesData } = useRoles();

  const submit = async (values: UserRoleChangeFormSchema) => {
    try {
      // Find role_id from role_code
      const selectedRole = rolesData?.data?.items?.find(
        (role) => role.code === values.role_code
      );

      if (!selectedRole) {
        throw new Error("Selected role not found");
      }

      if (!selectedRole.id) {
        throw new Error(`Role ID not found for role code: ${values.role_code}. Please ensure roles API returns id.`);
      }

      // ETag is required in header for PATCH operations
      // Use role.id as role_id in the request payload
      await mutations.changeUserRole(userId, {
        role_id: selectedRole.id,
      }, etag);
    } catch (error) {
      // Map API errors to form field errors
      const normalizedError = error as NormalizedError;

      if (normalizedError.fieldErrors) {
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof UserRoleChangeFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to change user role",
        });
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: mutations.isUpdating,
  };
}


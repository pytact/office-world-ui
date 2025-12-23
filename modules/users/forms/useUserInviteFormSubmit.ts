// User Invite Form Submit Hook
// Handles form submission and API error mapping following R10

import { UseFormReturn } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useUserMutations } from "@/hooks/useUserMutations";
import { useRoles } from "@/hooks/useUsers";
import { useAuthContext } from "@/context";
import { useToast } from "@/context/ToastContext";
import { UserInviteFormSchema } from "./user.schema";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

/**
 * Hook for handling user invitation form submission
 * Maps API errors to form field errors
 */
export function useUserInviteFormSubmit(
  form: UseFormReturn<UserInviteFormSchema>
) {
  const router = useRouter();
  const { isSuperAdmin } = useAuthContext();
  const mutations = useUserMutations();
  const { data: rolesData } = useRoles();
  const { showSuccess, showError } = useToast();

  const submit = async (values: UserInviteFormSchema) => {
    console.log("[useUserInviteFormSubmit] Submit called with values:", values);
    console.log("[useUserInviteFormSubmit] Roles data:", rolesData?.data?.items);
    
    try {
      // Find role_id from role_code
      const selectedRole = rolesData?.data?.items?.find(
        (role) => role.code === values.role_code
      );

      console.log("[useUserInviteFormSubmit] Selected role:", selectedRole);

      if (!selectedRole) {
        console.error("[useUserInviteFormSubmit] Selected role not found for code:", values.role_code);
        throw new Error("Selected role not found");
      }

      if (!selectedRole.id) {
        const errorMessage = `Role ID not found for role code: ${values.role_code}. The roles API must return id for invite operations.`;
        console.error("[useUserInviteFormSubmit] Role ID missing:", errorMessage);
        form.setError("root", {
          type: "server",
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      const payload = {
        email: values.email.trim(),
        role_id: selectedRole.id,
        company_slug: values.company_slug || null,
      };

      console.log("[useUserInviteFormSubmit] Calling mutations.inviteUser with payload:", payload);
      
      // Use role.id as role_id in the request payload
      await mutations.inviteUser(payload);

      console.log("[useUserInviteFormSubmit] API call successful");
      showSuccess("User invitation sent successfully");
      // Navigate to appropriate list after success
      router.push(isSuperAdmin ? "/platform/users" : "/company/users");
    } catch (error) {
      console.error("[useUserInviteFormSubmit] Error occurred:", error);
      const normalizedError = error as NormalizedError;
      console.error("[useUserInviteFormSubmit] Normalized error:", normalizedError);
      showError(normalizedError.message || "Failed to invite user");
      // Map API errors to form field errors

      if (normalizedError.fieldErrors) {
        console.log("[useUserInviteFormSubmit] Field errors:", normalizedError.fieldErrors);
        Object.entries(normalizedError.fieldErrors).forEach(([field, message]) => {
          form.setError(field as keyof UserInviteFormSchema, {
            type: "server",
            message,
          });
        });
      }

      // Set general form error if no field-specific errors
      if (!normalizedError.fieldErrors || Object.keys(normalizedError.fieldErrors).length === 0) {
        form.setError("root", {
          type: "server",
          message: normalizedError.message || "Failed to invite user",
        });
      }

      throw error;
    }
  };

  return {
    submit,
    isLoading: mutations.isInviting,
  };
}


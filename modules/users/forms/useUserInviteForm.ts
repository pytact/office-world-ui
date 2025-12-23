// User Invite Form Hook
// React Hook Form + Zod integration following R10

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserInviteSchema,
  UserInviteFormSchema,
} from "./user.schema";

interface UseUserInviteFormParams {
  defaultValues?: Partial<UserInviteFormSchema>;
}

/**
 * Hook for user invitation form
 * Uses React Hook Form with Zod validation
 */
export function useUserInviteForm(params?: UseUserInviteFormParams) {
  const defaultValues: UserInviteFormSchema = {
    email: params?.defaultValues?.email || "",
    role_code: params?.defaultValues?.role_code || "",
    company_slug: params?.defaultValues?.company_slug || null,
  };

  const form = useForm<UserInviteFormSchema>({
    resolver: zodResolver(UserInviteSchema),
    defaultValues,
    mode: "onBlur", // Only validate after field loses focus (better UX - no errors while typing)
    reValidateMode: "onChange", // Re-validate on change after first blur
    criteriaMode: "all", // Show all validation errors
  });

  return form;
}


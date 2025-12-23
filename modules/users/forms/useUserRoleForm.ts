// User Role Form Hook
// React Hook Form + Zod integration following R10

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserRoleChangeSchema,
  UserRoleChangeFormSchema,
} from "./user.schema";

interface UseUserRoleFormParams {
  defaultValues?: Partial<UserRoleChangeFormSchema>;
}

/**
 * Hook for user role change form
 * Uses React Hook Form with Zod validation
 */
export function useUserRoleForm(params?: UseUserRoleFormParams) {
  const defaultValues: UserRoleChangeFormSchema = {
    role_code: params?.defaultValues?.role_code || "",
  };

  const form = useForm<UserRoleChangeFormSchema>({
    resolver: zodResolver(UserRoleChangeSchema),
    defaultValues,
    mode: "onBlur",
  });

  return form;
}


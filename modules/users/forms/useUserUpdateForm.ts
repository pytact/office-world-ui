// User Update Form Hook
// React Hook Form + Zod integration following R10

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UserUpdateSchema,
  UserUpdateFormSchema,
} from "./user.schema";

interface UseUserUpdateFormParams {
  defaultValues?: Partial<UserUpdateFormSchema>;
}

/**
 * Hook for user update form (first_name, last_name)
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useUserUpdateForm(params?: UseUserUpdateFormParams) {
  const defaultValues: UserUpdateFormSchema = {
    first_name: params?.defaultValues?.first_name || null,
    last_name: params?.defaultValues?.last_name || null,
  };

  const form = useForm<UserUpdateFormSchema>({
    resolver: zodResolver(UserUpdateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


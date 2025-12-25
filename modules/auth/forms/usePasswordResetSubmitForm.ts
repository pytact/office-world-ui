// Password Reset Submit Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordResetSubmitSchema, PasswordResetSubmitFormSchema } from "./passwordReset.schema";

interface UsePasswordResetSubmitFormParams {
  defaultValues?: Partial<PasswordResetSubmitFormSchema>;
}

/**
 * Hook for password reset submit form
 * Uses React Hook Form with Zod validation
 */
export function usePasswordResetSubmitForm(params?: UsePasswordResetSubmitFormParams) {
  const defaultValues: PasswordResetSubmitFormSchema = {
    password: params?.defaultValues?.password || "",
    password_confirm: params?.defaultValues?.password_confirm || "",
  };

  const form = useForm<PasswordResetSubmitFormSchema>({
    resolver: zodResolver(PasswordResetSubmitSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


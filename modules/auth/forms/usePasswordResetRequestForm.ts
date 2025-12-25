// Password Reset Request Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordResetRequestSchema, PasswordResetRequestFormSchema } from "./passwordReset.schema";

interface UsePasswordResetRequestFormParams {
  defaultValues?: Partial<PasswordResetRequestFormSchema>;
}

/**
 * Hook for password reset request form
 * Uses React Hook Form with Zod validation
 */
export function usePasswordResetRequestForm(params?: UsePasswordResetRequestFormParams) {
  const defaultValues: PasswordResetRequestFormSchema = {
    email: params?.defaultValues?.email || "",
  };

  const form = useForm<PasswordResetRequestFormSchema>({
    resolver: zodResolver(PasswordResetRequestSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


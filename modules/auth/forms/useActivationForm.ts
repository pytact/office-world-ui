// User Activation Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivationSchema, ActivationFormSchema } from "./activation.schema";

interface UseActivationFormParams {
  defaultValues?: Partial<ActivationFormSchema>;
}

/**
 * Hook for user activation form
 * Uses React Hook Form with Zod validation
 */
export function useActivationForm(params?: UseActivationFormParams) {
  const defaultValues: ActivationFormSchema = {
    first_name: params?.defaultValues?.first_name || "",
    last_name: params?.defaultValues?.last_name || "",
    password: params?.defaultValues?.password || "",
    password_confirm: params?.defaultValues?.password_confirm || "",
  };

  const form = useForm<ActivationFormSchema>({
    resolver: zodResolver(ActivationSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


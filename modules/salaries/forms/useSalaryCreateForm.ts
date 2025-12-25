// Salary Create Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalaryCreateSchema, SalaryCreateFormSchema } from "./salary.schema";

interface UseSalaryCreateFormParams {
  defaultValues?: Partial<SalaryCreateFormSchema>;
}

/**
 * Hook for salary creation form
 * Uses React Hook Form with Zod validation
 */
export function useSalaryCreateForm(params?: UseSalaryCreateFormParams) {
  const defaultValues: SalaryCreateFormSchema = {
    amount: params?.defaultValues?.amount || "",
    currency: params?.defaultValues?.currency || "INR",
    payment_frequency: params?.defaultValues?.payment_frequency || "MONTHLY",
    effective_from: params?.defaultValues?.effective_from || "",
    effective_to: params?.defaultValues?.effective_to || null,
  };

  const form = useForm<SalaryCreateFormSchema>({
    resolver: zodResolver(SalaryCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


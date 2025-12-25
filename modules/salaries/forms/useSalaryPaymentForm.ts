// Salary Payment Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SalaryPaymentCreateSchema, SalaryPaymentCreateFormSchema } from "./salaryPayment.schema";

interface UseSalaryPaymentFormParams {
  defaultValues?: Partial<SalaryPaymentCreateFormSchema>;
}

/**
 * Hook for salary payment creation form
 * Uses React Hook Form with Zod validation
 */
export function useSalaryPaymentForm(params?: UseSalaryPaymentFormParams) {
  // Get current month and year as defaults
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // getMonth() returns 0-11
  const currentYear = now.getFullYear();

  const defaultValues: SalaryPaymentCreateFormSchema = {
    month: params?.defaultValues?.month || currentMonth,
    year: params?.defaultValues?.year || currentYear,
    payment_method: params?.defaultValues?.payment_method || "BANK_TRANSFER",
  };

  const form = useForm<SalaryPaymentCreateFormSchema>({
    resolver: zodResolver(SalaryPaymentCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


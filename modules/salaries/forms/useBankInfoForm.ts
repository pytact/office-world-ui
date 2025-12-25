// Bank Info Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BankInfoSchema, BankInfoFormSchema } from "./bankInfo.schema";

interface UseBankInfoFormParams {
  defaultValues?: Partial<BankInfoFormSchema>;
}

/**
 * Hook for bank information form
 * Uses React Hook Form with Zod validation
 */
export function useBankInfoForm(params?: UseBankInfoFormParams) {
  const defaultValues: BankInfoFormSchema = {
    bank_name: params?.defaultValues?.bank_name || "HDFC",
    branch: params?.defaultValues?.branch || "",
    account_number: params?.defaultValues?.account_number || "",
    ifsc_code: params?.defaultValues?.ifsc_code || "",
  };

  const form = useForm<BankInfoFormSchema>({
    resolver: zodResolver(BankInfoSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


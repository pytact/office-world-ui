// Salary Payment Form Schemas
// Zod validation schemas for salary payment forms
// Following R10 rules

import { z } from "zod";
import { PaymentMethod } from "@/utils/types/requests/salaryPayment";

/**
 * Salary Payment Create Form Schema
 * POST /v1/company/employees/{employee_id}/salary/salary-payments/run
 */
export const SalaryPaymentCreateSchema = z.object({
  month: z
    .number()
    .int("Month must be an integer")
    .min(1, "Month must be between 1 and 12")
    .max(12, "Month must be between 1 and 12"),
  year: z
    .number()
    .int("Year must be an integer")
    .min(2000, "Year must be between 2000 and 9999")
    .max(9999, "Year must be between 2000 and 9999"),
  payment_method: z.enum(["BANK_TRANSFER", "UPI", "CHEQUE", "CASH"] as const, {
    errorMap: () => ({ message: "Invalid payment method" }),
  }),
});

export type SalaryPaymentCreateFormSchema = z.infer<typeof SalaryPaymentCreateSchema>;


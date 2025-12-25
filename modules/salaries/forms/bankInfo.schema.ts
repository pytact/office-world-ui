// Bank Info Form Schemas
// Zod validation schemas for bank information forms
// Following R10 rules

import { z } from "zod";
import { BankName } from "@/utils/types/requests/bankInfo";

/**
 * Bank Info Create/Update Form Schema
 * POST /v1/company/employees/{employee_id}/salary/bank-info
 * PATCH /v1/company/employees/{employee_id}/salary/bank-info
 */
export const BankInfoSchema = z.object({
  bank_name: z.enum(["HDFC", "ICICI", "SBI", "AXIS", "KOTAK", "PNB", "BOB"] as const, {
    errorMap: () => ({ message: "Invalid bank name" }),
  }),
  branch: z
    .string()
    .min(1, "Branch is required")
    .max(255, "Branch must be 255 characters or less"),
  account_number: z
    .string()
    .min(8, "Account number must be at least 8 characters")
    .max(20, "Account number must be 20 characters or less")
    .regex(/^[A-Z0-9]+$/, "Account number must contain only uppercase letters and numbers"),
  ifsc_code: z
    .string()
    .length(11, "IFSC code must be exactly 11 characters")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "IFSC code must be in format: 4 uppercase letters + 0 + 6 alphanumeric (e.g., HDFC0001234)"),
});

export type BankInfoFormSchema = z.infer<typeof BankInfoSchema>;


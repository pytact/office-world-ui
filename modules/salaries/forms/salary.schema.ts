// Salary Form Schemas
// Zod validation schemas for salary forms
// Following R10 rules

import { z } from "zod";
import { Currency, PaymentFrequency } from "@/utils/types/requests/salary";

/**
 * Salary Create Form Schema
 * POST /v1/company/employees/{employee_id}/salary
 */
export const SalaryCreateSchema = z
  .object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid decimal with up to 2 decimal places")
      .refine(
        (val) => {
          const num = parseFloat(val);
          return num > 0 && num <= 999999999.99;
        },
        {
          message: "Amount must be greater than 0 and less than or equal to 999,999,999.99",
        }
      ),
    currency: z.enum(["INR", "USD", "EUR", "GBP", "AUD", "CAD"] as const, {
      errorMap: () => ({ message: "Invalid currency" }),
    }),
    payment_frequency: z.enum(["MONTHLY", "BI_WEEKLY", "WEEKLY"] as const, {
      errorMap: () => ({ message: "Invalid payment frequency" }),
    }),
    effective_from: z
      .string()
      .min(1, "Effective from date is required")
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .refine(
        (date) => {
          const dateObj = new Date(date);
          return !isNaN(dateObj.getTime());
        },
        {
          message: "Invalid date",
        }
      ),
    effective_to: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      .nullable()
      .optional()
      .refine(
        (val) => {
          if (!val) return true; // null is allowed
          const dateObj = new Date(val);
          return !isNaN(dateObj.getTime());
        },
        {
          message: "Invalid date",
        }
      ),
  })
  .refine(
    (data) => {
      if (data.effective_to) {
        const fromDate = new Date(data.effective_from);
        const toDate = new Date(data.effective_to);
        return toDate >= fromDate;
      }
      return true;
    },
    {
      message: "Effective to date must be greater than or equal to effective from date",
      path: ["effective_to"],
    }
  );

export type SalaryCreateFormSchema = z.infer<typeof SalaryCreateSchema>;

/**
 * Salary Revise Form Schema
 * POST /v1/company/employees/{employee_id}/salary/revise
 * Same structure as Create, but used for salary increments/changes
 */
export const SalaryReviseSchema = SalaryCreateSchema;

export type SalaryReviseFormSchema = z.infer<typeof SalaryReviseSchema>;


// utils/types/requests/salary.ts

// ENUM Type Definitions
export type Currency = "INR" | "USD" | "EUR" | "GBP" | "AUD" | "CAD";

export type PaymentFrequency = "MONTHLY" | "BI_WEEKLY" | "WEEKLY";

// Base Interface
export interface SalaryBase {
  amount: string; // Decimal string, min > 0, max 999999999.99, 2 decimal places
  currency: Currency;
  payment_frequency: PaymentFrequency;
  effective_from: string; // ISO 8601 date format (YYYY-MM-DD)
  effective_to: string; // ISO 8601 date format (YYYY-MM-DD), must be >= effective_from
}

// Create Interface (for initial salary creation)
export interface SalaryCreate extends SalaryBase {
  // All fields from SalaryBase are required
}

// Revise Interface (for salary revision/increment)
// Same structure as Create, but used with different endpoint
export interface SalaryRevise extends SalaryBase {
  // All fields from SalaryBase are required
}

// Note: There is no Update interface because salary updates are handled via Revise endpoint
// which creates a new record and auto-closes the previous one


// utils/types/requests/salaryPayment.ts

// ENUM Type Definitions
export type PaymentMethod = "BANK_TRANSFER" | "UPI" | "CHEQUE" | "CASH";

export type SortOrder = "asc" | "desc";

export type SalaryPaymentSortBy =
  | "paid_on"
  | "month"
  | "year"
  | "amount"
  | "created_at";

// Create Interface
export interface SalaryPaymentCreate {
  employee_id: string; // UUID, RFC 4122 UUID v4 format
  month: number; // Integer, min 1, max 12
  year: number; // Integer, min 2000, max 9999, YYYY format
  payment_method: PaymentMethod;
}

// List Parameters Interface (for GET /v1/company/employees/{employee_id}/salary/payments)
export interface SalaryPaymentListParams {
  page?: number; // Default: 1, minimum: 1
  page_size?: number; // Default: 20, range: 1-100
  year?: number | null; // Filter by year (YYYY format, 2000-9999)
  month?: number | null; // Filter by month (1-12)
  payment_method?: PaymentMethod | null; // Filter by payment method
  sort_by?: SalaryPaymentSortBy; // Default: "paid_on"
  sort_order?: SortOrder; // Default: "desc"
}

// Company Salary Payment List Parameters Interface (for GET /v1/salary-payments)
export interface CompanySalaryPaymentListParams {
  month: number; // Required, integer, 1-12
  year: number; // Required, integer, 2000-9999, YYYY format
  page?: number; // Default: 1, minimum: 1
  page_size?: number; // Default: 20, range: 1-100
  sort_by?: SalaryPaymentSortBy; // Default: "paid_on"
  sort_order?: SortOrder; // Default: "desc"
}


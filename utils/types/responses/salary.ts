// utils/types/responses/salary.ts

import type { Currency, PaymentFrequency } from "../requests/salary";
import type { ApiSuccessResponse } from "./common";

// SalaryDetails Entity Response
export interface SalaryDetailsResponse {
  id: string; // UUID
  employee_id: string; // UUID
  amount: string; // Decimal string, e.g., "80000.00"
  currency: Currency;
  payment_frequency: PaymentFrequency;
  effective_from: string; // ISO 8601 date format (YYYY-MM-DD)
  effective_to: string | null; // ISO 8601 date format (YYYY-MM-DD) or null for active salary
  created_at: string; // ISO 8601 datetime format (UTC)
  updated_at: string; // ISO 8601 datetime format (UTC)
  created_by: string;
  updated_by: string;
}

// SalaryHistory Entity Response
export interface SalaryHistoryResponse {
  id: string; // UUID
  previous_amount: string; // Decimal string
  new_amount: string; // Decimal string
  effective_from: string; // ISO 8601 date format (YYYY-MM-DD)
  changed_by: string;
  created_at: string; // ISO 8601 datetime format (UTC)
}

// Standard API Response Wrapper for SalaryDetails
export interface SalaryDetailsSuccessResponse
  extends ApiSuccessResponse<SalaryDetailsResponse> {}

// Standard API Response Wrapper for SalaryHistory List (array, not paginated)
export interface SalaryHistoryListResponse
  extends ApiSuccessResponse<SalaryHistoryResponse[]> {}

// Mutation Response for Create/Revise Salary
export interface SalaryMutationResponse
  extends ApiSuccessResponse<SalaryDetailsResponse> {}


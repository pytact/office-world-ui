// utils/types/responses/salaryPayment.ts

import type { PaymentMethod } from "../requests/salaryPayment";
import type { ApiSuccessResponse } from "./common";

// SalaryPayment Entity Response
export interface SalaryPaymentResponse {
  id: string; // UUID
  employee_id: string; // UUID
  amount: string; // Decimal string, e.g., "80000.00"
  currency: string; // Currency code, e.g., "INR"
  month: number; // Integer, 1-12
  year: number; // Integer, YYYY format
  paid_on: string; // ISO 8601 datetime format (UTC)
  payment_method: PaymentMethod;
  slip_url: string; // Relative URL path
  created_at: string; // ISO 8601 datetime format (UTC)
  created_by: string;
}

// SalaryPayment Entity Response with Derived Fields (for create response)
export interface SalaryPaymentWithDerivedResponse extends SalaryPaymentResponse {
  payable_amount: string; // Decimal string, same as amount
  payment_period_label: string; // Human-readable label, e.g., "March 2024"
}

// Pagination Metadata for SalaryPayment List
export interface SalaryPaymentPaginationMeta {
  total: number;
  page: number;
  page_size: number; // Note: API uses snake_case
  total_pages: number;
  next_page: string | null; // Full relative URL with query params or null
  prev_page: string | null; // Full relative URL with query params or null
}

// Paginated SalaryPayment List Data
export interface SalaryPaymentPaginatedData {
  items: SalaryPaymentResponse[];
  total: number;
  page: number;
  page_size: number; // Note: API uses snake_case
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

// Standard API Response Wrapper for Single SalaryPayment
export interface SalaryPaymentSuccessResponse
  extends ApiSuccessResponse<SalaryPaymentWithDerivedResponse> {}

// Standard API Response Wrapper for Paginated SalaryPayment List
export interface SalaryPaymentListResponse
  extends ApiSuccessResponse<SalaryPaymentPaginatedData> {}

// Mutation Response for Create SalaryPayment
export interface SalaryPaymentMutationResponse
  extends ApiSuccessResponse<SalaryPaymentWithDerivedResponse> {}

// Company SalaryPayment List Response (same structure as employee list)
export interface CompanySalaryPaymentListResponse
  extends ApiSuccessResponse<SalaryPaymentPaginatedData> {}


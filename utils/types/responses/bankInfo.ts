// utils/types/responses/bankInfo.ts

import type { BankName } from "../requests/bankInfo";
import type { ApiSuccessResponse } from "./common";

// BankInfo Entity Response
export interface BankInfoResponse {
  id: string; // UUID
  employee_id: string; // UUID
  bank_name: BankName;
  branch: string;
  account_number: string; // Masked format: "****3456"
  ifsc_code: string; // Masked format: "HDFC****234"
  created_at: string; // ISO 8601 datetime format (UTC)
  updated_at: string; // ISO 8601 datetime format (UTC)
  created_by: string | null; // May be null if created before audit tracking
  updated_by: string;
}

// Standard API Response Wrapper for BankInfo
export interface BankInfoSuccessResponse
  extends ApiSuccessResponse<BankInfoResponse> {}

// Mutation Response for Create/Update BankInfo
export interface BankInfoMutationResponse
  extends ApiSuccessResponse<BankInfoResponse> {}


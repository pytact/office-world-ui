// utils/types/requests/bankInfo.ts

// ENUM Type Definitions
export type BankName = "HDFC" | "ICICI" | "SBI" | "AXIS" | "KOTAK" | "PNB" | "BOB";

// Base Interface
export interface BankInfoBase {
  bank_name: BankName;
  branch: string; // String, min 1 character, max 255 characters
  account_number: string; // String, min 8 characters, max 20 characters, alphanumeric only
  ifsc_code: string; // String, 11 characters, format: 4 uppercase letters + 0 + 6 alphanumeric (e.g., "HDFC0001234")
}

// Create Interface
export interface BankInfoCreate extends BankInfoBase {
  // All fields from BankInfoBase are required
}

// Update Interface
// Same structure as Create - all fields are required for update
export interface BankInfoUpdate extends BankInfoBase {
  // All fields from BankInfoBase are required
}


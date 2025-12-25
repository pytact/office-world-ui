// Salary Transformations Hook
// Encapsulates data transformations for salary display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import type { Currency, PaymentFrequency } from "@/utils/types/requests/salary";
import type { PaymentMethod } from "@/utils/types/requests/salaryPayment";
import type {
  SalaryDetailsResponse,
  SalaryHistoryResponse,
} from "@/utils/types/responses/salary";
import type {
  BankInfoResponse,
} from "@/utils/types/responses/bankInfo";
import type {
  SalaryPaymentResponse,
} from "@/utils/types/responses/salaryPayment";

// Currency Symbol Mappings
const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AUD: "A$",
  CAD: "C$",
};

// Payment Frequency Labels
const PAYMENT_FREQUENCY_LABELS: Record<PaymentFrequency, string> = {
  MONTHLY: "Monthly",
  BI_WEEKLY: "Bi-weekly",
  WEEKLY: "Weekly",
};

// Payment Method Labels
const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  BANK_TRANSFER: "Bank Transfer",
  UPI: "UPI",
  CHEQUE: "Cheque",
  CASH: "Cash",
};

// Month Names
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats currency amount with symbol
 * @param amount - Decimal string (e.g., "80000.00")
 * @param currency - Currency code
 * @returns Formatted currency string (e.g., "₹80,000.00")
 */
export function formatCurrency(
  amount: string | null | undefined,
  currency: Currency | string
): string {
  if (!amount) return "—";
  try {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return amount;
    
    const symbol = CURRENCY_SYMBOLS[currency as Currency] || currency;
    const formatted = numAmount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    
    return `${symbol}${formatted}`;
  } catch {
    return amount;
  }
}

/**
 * Formats ISO 8601 date string to human-readable format
 * @param dateString - ISO 8601 date string (YYYY-MM-DD)
 * @returns Formatted date string (e.g., "01 Jan 2024")
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats ISO 8601 datetime string to human-readable format
 * @param dateString - ISO 8601 datetime string
 * @returns Formatted datetime string (e.g., "01 Jan 2024, 10:30 AM")
 */
export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateString;
  }
}

/**
 * Formats payment period label from month and year
 * @param month - Month number (1-12)
 * @param year - Year (YYYY)
 * @returns Formatted period label (e.g., "March 2024")
 */
export function formatPaymentPeriodLabel(
  month: number | null | undefined,
  year: number | null | undefined
): string {
  if (!month || !year) return "—";
  if (month < 1 || month > 12) return "—";
  
  const monthName = MONTH_NAMES[month - 1];
  return `${monthName} ${year}`;
}

/**
 * Formats salary period label from effective dates
 * @param effectiveFrom - Start date (YYYY-MM-DD)
 * @param effectiveTo - End date (YYYY-MM-DD) or null
 * @returns Formatted period label (e.g., "Jan 2024 - Dec 2024" or "Jan 2024 - Present")
 */
export function formatSalaryPeriod(
  effectiveFrom: string | null | undefined,
  effectiveTo: string | null | undefined
): string {
  if (!effectiveFrom) return "—";
  
  const fromFormatted = formatDate(effectiveFrom);
  const toFormatted = effectiveTo ? formatDate(effectiveTo) : "Present";
  
  return `${fromFormatted} - ${toFormatted}`;
}

/**
 * Gets currency symbol
 * @param currency - Currency code
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: Currency | string): string {
  return CURRENCY_SYMBOLS[currency as Currency] || currency;
}

/**
 * Gets payment frequency label
 * @param frequency - Payment frequency enum
 * @returns Human-readable label
 */
export function getPaymentFrequencyLabel(
  frequency: PaymentFrequency | null | undefined
): string {
  if (!frequency) return "—";
  return PAYMENT_FREQUENCY_LABELS[frequency] || frequency;
}

/**
 * Gets payment method label
 * @param method - Payment method enum
 * @returns Human-readable label
 */
export function getPaymentMethodLabel(
  method: PaymentMethod | null | undefined
): string {
  if (!method) return "—";
  return PAYMENT_METHOD_LABELS[method] || method;
}

/**
 * Calculates salary change percentage
 * @param previousAmount - Previous salary amount
 * @param newAmount - New salary amount
 * @returns Percentage change (e.g., 6.67 for 6.67% increase)
 */
export function calculateSalaryChangePercentage(
  previousAmount: string | null | undefined,
  newAmount: string | null | undefined
): number | null {
  if (!previousAmount || !newAmount) return null;
  
  try {
    const prev = parseFloat(previousAmount);
    const next = parseFloat(newAmount);
    
    if (isNaN(prev) || isNaN(next) || prev === 0) return null;
    
    const change = ((next - prev) / prev) * 100;
    return Math.round(change * 100) / 100; // Round to 2 decimal places
  } catch {
    return null;
  }
}

// Transformed Salary Details
export interface TransformedSalaryDetails extends SalaryDetailsResponse {
  amountFormatted: string;
  currencySymbol: string;
  paymentFrequencyLabel: string;
  effectiveFromFormatted: string;
  effectiveToFormatted: string | null;
  salaryPeriodLabel: string;
  isActive: boolean;
  createdAtFormatted: string;
  updatedAtFormatted: string;
}

/**
 * Transform salary details for display
 */
export function transformSalaryDetails(
  salary: SalaryDetailsResponse
): TransformedSalaryDetails {
  const isActive = salary.effective_to === null;
  
  return {
    ...salary,
    amountFormatted: formatCurrency(salary.amount, salary.currency),
    currencySymbol: getCurrencySymbol(salary.currency),
    paymentFrequencyLabel: getPaymentFrequencyLabel(salary.payment_frequency),
    effectiveFromFormatted: formatDate(salary.effective_from),
    effectiveToFormatted: salary.effective_to ? formatDate(salary.effective_to) : null,
    salaryPeriodLabel: formatSalaryPeriod(salary.effective_from, salary.effective_to),
    isActive,
    createdAtFormatted: formatDateTime(salary.created_at),
    updatedAtFormatted: formatDateTime(salary.updated_at),
  };
}

// Transformed Salary History Entry
export interface TransformedSalaryHistory extends SalaryHistoryResponse {
  previousAmountFormatted: string;
  newAmountFormatted: string;
  effectiveFromFormatted: string;
  createdAtFormatted: string;
  changePercentage: number | null;
  changeLabel: string;
}

/**
 * Transform salary history entry for display
 */
export function transformSalaryHistory(
  history: SalaryHistoryResponse,
  currency: Currency = "INR"
): TransformedSalaryHistory {
  const changePercentage = calculateSalaryChangePercentage(
    history.previous_amount,
    history.new_amount
  );
  
  const changeLabel = changePercentage
    ? changePercentage > 0
      ? `+${changePercentage.toFixed(2)}%`
      : `${changePercentage.toFixed(2)}%`
    : "—";
  
  return {
    ...history,
    previousAmountFormatted: formatCurrency(history.previous_amount, currency),
    newAmountFormatted: formatCurrency(history.new_amount, currency),
    effectiveFromFormatted: formatDate(history.effective_from),
    createdAtFormatted: formatDateTime(history.created_at),
    changePercentage,
    changeLabel,
  };
}

// Transformed Bank Info
export interface TransformedBankInfo extends BankInfoResponse {
  accountNumberDisplay: string; // Already masked from API
  ifscCodeDisplay: string; // Already masked from API
  createdAtFormatted: string;
  updatedAtFormatted: string;
}

/**
 * Transform bank info for display
 */
export function transformBankInfo(
  bankInfo: BankInfoResponse
): TransformedBankInfo {
  return {
    ...bankInfo,
    accountNumberDisplay: bankInfo.account_number, // Already masked: "****3456"
    ifscCodeDisplay: bankInfo.ifsc_code, // Already masked: "HDFC****234"
    createdAtFormatted: formatDateTime(bankInfo.created_at),
    updatedAtFormatted: formatDateTime(bankInfo.updated_at),
  };
}

// Transformed Salary Payment
export interface TransformedSalaryPayment extends SalaryPaymentResponse {
  amountFormatted: string;
  currencySymbol: string;
  paymentMethodLabel: string;
  paymentPeriodLabel: string;
  paidOnFormatted: string;
  createdAtFormatted: string;
}

/**
 * Transform salary payment for display
 */
export function transformSalaryPayment(
  payment: SalaryPaymentResponse
): TransformedSalaryPayment {
  return {
    ...payment,
    amountFormatted: formatCurrency(payment.amount, payment.currency),
    currencySymbol: getCurrencySymbol(payment.currency),
    paymentMethodLabel: getPaymentMethodLabel(payment.payment_method),
    paymentPeriodLabel: formatPaymentPeriodLabel(payment.month, payment.year),
    paidOnFormatted: formatDateTime(payment.paid_on),
    createdAtFormatted: formatDateTime(payment.created_at),
  };
}

/**
 * Hook for transforming salary details
 */
export function useSalaryDetailsTransformation(
  salary: SalaryDetailsResponse | null | undefined
): TransformedSalaryDetails | null {
  return useMemo(() => {
    if (!salary) return null;
    return transformSalaryDetails(salary);
  }, [salary]);
}

/**
 * Hook for transforming salary history array
 */
export function useSalaryHistoryTransformation(
  history: SalaryHistoryResponse[] | null | undefined,
  currency: Currency = "INR"
): TransformedSalaryHistory[] {
  return useMemo(() => {
    if (!history || history.length === 0) return [];
    return history.map((entry) => transformSalaryHistory(entry, currency));
  }, [history, currency]);
}

/**
 * Hook for transforming bank info
 */
export function useBankInfoTransformation(
  bankInfo: BankInfoResponse | null | undefined
): TransformedBankInfo | null {
  return useMemo(() => {
    if (!bankInfo) return null;
    return transformBankInfo(bankInfo);
  }, [bankInfo]);
}

/**
 * Hook for transforming salary payment array
 */
export function useSalaryPaymentTransformation(
  payments: SalaryPaymentResponse[] | null | undefined
): TransformedSalaryPayment[] {
  return useMemo(() => {
    if (!payments || payments.length === 0) return [];
    return payments.map(transformSalaryPayment);
  }, [payments]);
}


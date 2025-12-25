// BankInfo Detail Hook
// Encapsulates transformations and business logic for bank info view
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { useGetBankInfo } from "./useBankInfo";
import {
  useBankInfoTransformation,
  type TransformedBankInfo,
} from "./useSalaryTransformations";
import type { BankInfoResponse } from "@/utils/types/responses/bankInfo";

interface UseBankInfoDetailReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  bankInfo: TransformedBankInfo | null;
  rawBankInfo: BankInfoResponse | null;

  // Derived fields
  hasBankInfo: boolean;
  canUpdate: boolean; // Can update if bank info exists
  canDelete: boolean; // Can delete if bank info exists
}

/**
 * Hook for bank info detail view with transformations
 * Encapsulates all business logic and transformations for bank info screen
 * @param employee_id - Employee ID (UUID)
 * @returns Transformed bank info data and derived fields
 */
export function useBankInfoDetail(
  employee_id: string | null
): UseBankInfoDetailReturn {
  const query = useGetBankInfo(employee_id);

  // Transform bank info data
  // Handle null response (404 - no bank info exists) gracefully
  // query.data can be null when 404 is returned (no bank info exists)
  const transformedBankInfo = useBankInfoTransformation(
    query.data?.data || null
  );

  // Derived fields
  const hasBankInfo = useMemo(() => {
    return transformedBankInfo !== null;
  }, [transformedBankInfo]);

  // CEO/HR can always manage (create or update) bank info
  // canUpdate means "can manage" - create if doesn't exist, update if exists
  const canUpdate = useMemo(() => {
    // Always true for CEO/HR (access control is at route level)
    // This allows both create and update operations
    return true;
  }, []);

  const canDelete = useMemo(() => {
    return hasBankInfo;
  }, [hasBankInfo]);

  // 404 is not an error - it just means bank info doesn't exist yet
  const isError = useMemo(() => {
    // Only treat as error if it's not a 404
    if (query.error) {
      const error = query.error as any;
      const is404 = error?.statusCode === 404 || error?.response?.status === 404;
      return !is404; // 404 is not an error
    }
    return query.isError;
  }, [query.error, query.isError]);

  return {
    isLoading: query.isLoading,
    isError,
    error: isError ? (query.error as Error | null) : null,
    refetch: query.refetch,
    bankInfo: transformedBankInfo,
    rawBankInfo: query.data?.data || null,
    hasBankInfo,
    canUpdate,
    canDelete,
  };
}


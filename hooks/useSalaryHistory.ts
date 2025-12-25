// Salary History Hook
// Encapsulates transformations and business logic for salary history view
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { useGetSalaryHistory } from "./useSalary";
import {
  useSalaryHistoryTransformation,
  type TransformedSalaryHistory,
} from "./useSalaryTransformations";
import type { SalaryHistoryResponse } from "@/utils/types/responses/salary";
import type { Currency } from "@/utils/types/requests/salary";

interface UseSalaryHistoryReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  history: TransformedSalaryHistory[];
  rawHistory: SalaryHistoryResponse[];

  // Derived fields
  hasHistory: boolean;
  totalChanges: number;
  latestChange: TransformedSalaryHistory | null;
}

/**
 * Hook for salary history view with transformations
 * Encapsulates all business logic and transformations for salary history screen
 * @param employee_id - Employee ID (UUID)
 * @param currency - Currency for formatting (defaults to "INR")
 * @returns Transformed salary history data and derived fields
 */
export function useSalaryHistory(
  employee_id: string | null,
  currency: Currency = "INR"
): UseSalaryHistoryReturn {
  const query = useGetSalaryHistory(employee_id);

  // Transform history data
  const transformedHistory = useSalaryHistoryTransformation(
    query.data?.data || null,
    currency
  );

  // Derived fields
  const hasHistory = useMemo(() => {
    return transformedHistory.length > 0;
  }, [transformedHistory.length]);

  const totalChanges = useMemo(() => {
    return transformedHistory.length;
  }, [transformedHistory.length]);

  const latestChange = useMemo(() => {
    return transformedHistory.length > 0 ? transformedHistory[0] : null;
  }, [transformedHistory]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    history: transformedHistory,
    rawHistory: query.data?.data || [],
    hasHistory,
    totalChanges,
    latestChange,
  };
}


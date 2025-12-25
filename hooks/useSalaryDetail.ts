// Salary Detail Hook
// Encapsulates transformations and business logic for salary detail view
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { useGetActiveSalary } from "./useSalary";
import {
  useSalaryDetailsTransformation,
  transformSalaryDetails,
  type TransformedSalaryDetails,
} from "./useSalaryTransformations";
import type { SalaryDetailsResponse } from "@/utils/types/responses/salary";

interface UseSalaryDetailReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  salary: TransformedSalaryDetails | null;
  rawSalary: SalaryDetailsResponse | null;

  // Derived fields
  hasActiveSalary: boolean;
  isActive: boolean;
  canRevise: boolean; // Can revise if active salary exists
}

/**
 * Hook for salary detail view with transformations
 * Encapsulates all business logic and transformations for salary overview screen
 * @param employee_id - Employee ID (UUID)
 * @returns Transformed salary data and derived fields
 */
export function useSalaryDetail(
  employee_id: string | null
): UseSalaryDetailReturn {
  const query = useGetActiveSalary(employee_id);

  // Transform salary data
  const transformedSalary = useSalaryDetailsTransformation(
    query.data?.data || null
  );

  // Derived fields
  const hasActiveSalary = useMemo(() => {
    return transformedSalary !== null;
  }, [transformedSalary]);

  const isActive = useMemo(() => {
    return transformedSalary?.isActive ?? false;
  }, [transformedSalary?.isActive]);

  // CEO/HR can always revise if there's an active salary
  // isActive check ensures we only allow revision of currently active salaries
  const canRevise = useMemo(() => {
    // If there's an active salary, allow revision (CEO/HR only - access control at route level)
    return hasActiveSalary;
  }, [hasActiveSalary]);

  // 404 is not an error - it just means no active salary exists yet
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
    salary: transformedSalary,
    rawSalary: query.data?.data || null,
    hasActiveSalary,
    isActive,
    canRevise,
  };
}


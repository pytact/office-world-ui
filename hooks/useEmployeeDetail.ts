// Employee Detail Hook
// Encapsulates transformations and business logic for employee detail view
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { useGetEmployee } from "./useEmployees";
import {
  transformEmployeeDetail,
  type TransformedEmployeeDetail,
} from "./useEmployeeTransformations";
import type { EmployeeDetail } from "@/utils/types/responses/employee";

interface UseEmployeeDetailReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  employee: TransformedEmployeeDetail | null;
  rawEmployee: EmployeeDetail | null;

  // Derived fields
  canEdit: boolean;
  canDeactivate: boolean;
  canSoftDelete: boolean;
  isActive: boolean;
  isDeleted: boolean;
}

/**
 * Hook for employee detail view with transformations
 * Encapsulates all business logic and transformations for detail screen
 * @param employee_id - Employee ID (UUID)
 * @returns Transformed employee data and derived fields
 */
export function useEmployeeDetail(
  employee_id: string | null
): UseEmployeeDetailReturn {
  const query = useGetEmployee(employee_id);

  // Transform employee data
  const transformedEmployee = useMemo(() => {
    if (!query.data?.data) return null;
    return transformEmployeeDetail(query.data.data);
  }, [query.data?.data]);

  // Derived fields from transformed employee
  const canEdit = useMemo(() => {
    return transformedEmployee?.can_edit_employee ?? false;
  }, [transformedEmployee?.can_edit_employee]);

  const canDeactivate = useMemo(() => {
    return transformedEmployee?.can_deactivate ?? false;
  }, [transformedEmployee?.can_deactivate]);

  const canSoftDelete = useMemo(() => {
    return transformedEmployee?.can_soft_delete ?? false;
  }, [transformedEmployee?.can_soft_delete]);

  const isActive = useMemo(() => {
    return transformedEmployee?.is_active ?? false;
  }, [transformedEmployee?.is_active]);

  const isDeleted = useMemo(() => {
    return transformedEmployee?.is_deleted ?? false;
  }, [transformedEmployee?.is_deleted]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    employee: transformedEmployee,
    rawEmployee: query.data?.data || null,
    canEdit,
    canDeactivate,
    canSoftDelete,
    isActive,
    isDeleted,
  };
}


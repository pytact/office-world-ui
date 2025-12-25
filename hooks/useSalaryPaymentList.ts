// Salary Payment List Hook
// Combines query, pagination, and transformation logic for salary payment lists
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { useGetSalaryPayments } from "./useSalaryPayment";
import {
  useSalaryPaymentTransformation,
  type TransformedSalaryPayment,
} from "./useSalaryTransformations";
import type { SalaryPaymentResponse } from "@/utils/types/responses/salaryPayment";
import type { SalaryPaymentListParams } from "@/utils/types/requests/salaryPayment";

interface UseSalaryPaymentListParams {
  employee_id: string | null;
  initialParams?: SalaryPaymentListParams;
}

interface UseSalaryPaymentListReturn {
  // Query state
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Data
  payments: TransformedSalaryPayment[];
  rawPayments: SalaryPaymentResponse[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
  };

  // Derived fields
  hasPayments: boolean;
  totalPayments: number;
}

/**
 * Hook that combines query, pagination, and transformation logic for salary payment lists
 * Encapsulates all business logic for salary payment list screens
 * @param params - Configuration for salary payment list
 * @returns Combined state, data, and pagination
 */
export function useSalaryPaymentList(
  params: UseSalaryPaymentListParams
): UseSalaryPaymentListReturn {
  const query = useGetSalaryPayments(
    params.employee_id,
    params.initialParams
  );

  // Transform payment data
  const rawPayments = useMemo(() => {
    return query.data?.data?.items || [];
  }, [query.data?.data?.items]);

  const transformedPayments = useSalaryPaymentTransformation(rawPayments);

  // Pagination data
  const pagination = useMemo(() => {
    if (!query.data?.data) {
      return {
        total: 0,
        page: params.initialParams?.page || 1,
        pageSize: params.initialParams?.page_size || 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        prevPage: null,
      };
    }

    return {
      total: query.data.data.total,
      page: query.data.data.page,
      pageSize: query.data.data.page_size,
      totalPages: query.data.data.total_pages,
      hasNextPage: query.data.data.next_page !== null,
      hasPreviousPage: query.data.data.prev_page !== null,
      nextPage: query.data.data.next_page,
      prevPage: query.data.data.prev_page,
    };
  }, [query.data?.data, params.initialParams?.page, params.initialParams?.page_size]);

  // Derived fields
  const hasPayments = useMemo(() => {
    return transformedPayments.length > 0;
  }, [transformedPayments.length]);

  const totalPayments = useMemo(() => {
    return pagination.total;
  }, [pagination.total]);

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    payments: transformedPayments,
    rawPayments,
    pagination,
    hasPayments,
    totalPayments,
  };
}


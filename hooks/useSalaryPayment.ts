// SalaryPayment Hooks
// F-006: Salary & History Management
// React Query hooks for salary payment operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { SalaryPaymentService } from "@/services/salaryPayment.service";
import {
  SalaryPaymentCreate,
  SalaryPaymentListParams,
  CompanySalaryPaymentListParams,
} from "@/utils/types/requests/salaryPayment";

/**
 * Hook for listing employee salary payments with pagination and filtering
 * GET /v1/company/employees/{employee_id}/salary/payments
 * Access: Employee (self only), CEO, HR (company scope)
 * @param employee_id - Employee ID (UUID)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with salary payment list data and state
 */
export function useGetSalaryPayments(
  employee_id: string | null,
  params?: SalaryPaymentListParams
) {
  return useQuery({
    queryKey: [
      "salaryPayments",
      employee_id,
      params?.page,
      params?.page_size,
      params?.year,
      params?.month,
      params?.payment_method,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => {
      if (!employee_id) {
        throw new Error("Employee ID is required");
      }
      return SalaryPaymentService.list(employee_id, params);
    },
    enabled: !!employee_id, // Only run query if employee_id is provided
    staleTime: 30 * 1000, // 30 seconds - payment list changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for listing company-wide salary payments by month/year
 * GET /v1/salary-payments
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: month and year are required query parameters
 * @param params - Query parameters including required month and year
 * @returns Query object with company salary payment list data and state
 */
export function useGetSalaryPaymentsByMonthYear(
  params: CompanySalaryPaymentListParams
) {
  return useQuery({
    queryKey: [
      "salaryPayments",
      "company",
      params.month,
      params.year,
      params.page,
      params.page_size,
      params.sort_by,
      params.sort_order,
    ],
    queryFn: () => SalaryPaymentService.listByMonthYear(params),
    staleTime: 30 * 1000, // 30 seconds - payment list changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for creating/executing salary payment for an employee
 * POST /v1/company/employees/{employee_id}/salary/salary-payments/run
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: Salary slip generation and email delivery are async operations
 * @returns Mutation object with create function and state
 */
export function useCreateSalaryPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
    }: {
      employee_id: string;
      payload: SalaryPaymentCreate;
    }) => SalaryPaymentService.create(employee_id, payload),
    onSuccess: async (_, variables) => {
      // Invalidate employee salary payments list
      await queryClient.invalidateQueries({
        queryKey: ["salaryPayments", variables.employee_id],
      });
      // Invalidate company-wide payments for the month/year
      await queryClient.invalidateQueries({
        queryKey: [
          "salaryPayments",
          "company",
          variables.payload.month,
          variables.payload.year,
        ],
      });
    },
  });
}


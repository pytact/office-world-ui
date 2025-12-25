// BankInfo Hooks
// F-006: Salary & History Management
// React Query hooks for bank information operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { BankInfoService } from "@/services/bankInfo.service";
import {
  BankInfoCreate,
  BankInfoUpdate,
} from "@/utils/types/requests/bankInfo";

/**
 * Hook for getting bank information for an employee
 * GET /v1/company/employees/{employee_id}/salary/bank-info
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: 404 responses are treated as "no bank info exists" (not an error)
 * @param employee_id - Employee ID (UUID)
 * @returns Query object with bank info data and state
 */
export function useGetBankInfo(employee_id: string | null) {
  return useQuery({
    queryKey: ["bankInfo", employee_id],
    queryFn: async () => {
      if (!employee_id) {
        const error = new Error("Employee ID is required");
        if (process.env.NODE_ENV === "development") {
          console.error("[useGetBankInfo] Employee ID is missing");
        }
        throw error;
      }
      
      try {
        return await BankInfoService.get(employee_id);
      } catch (error: any) {
        // Handle 404 as "no bank info exists" - not an error
        // This is expected when an employee hasn't set up bank info yet
        if (error?.statusCode === 404 || error?.response?.status === 404) {
          // Return a response structure with null data to match the expected type
          return { data: null } as any;
        }
        // Re-throw other errors
        throw error;
      }
    },
    enabled: !!employee_id, // Only run query if employee_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - bank info is relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (bank info doesn't exist)
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Hook for creating bank information for an employee
 * POST /v1/company/employees/{employee_id}/salary/bank-info
 * Access: CEO, HR only (Employee and Manager access denied)
 * @returns Mutation object with create function and state
 */
export function useCreateBankInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
    }: {
      employee_id: string;
      payload: BankInfoCreate;
    }) => BankInfoService.create(employee_id, payload),
    onSuccess: async (_, variables) => {
      // Invalidate bank info query
      await queryClient.invalidateQueries({
        queryKey: ["bankInfo", variables.employee_id],
      });
    },
  });
}

/**
 * Hook for updating bank information for an employee
 * PATCH /v1/company/employees/{employee_id}/salary/bank-info
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: Requires If-Match header with ETag from GET bank-info response
 * @returns Mutation object with update function and state
 */
export function useUpdateBankInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
      etag,
    }: {
      employee_id: string;
      payload: BankInfoUpdate;
      etag?: string;
    }) => BankInfoService.update(employee_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate bank info query
      await queryClient.invalidateQueries({
        queryKey: ["bankInfo", variables.employee_id],
      });
    },
  });
}

/**
 * Hook for soft deleting bank information for an employee
 * DELETE /v1/company/employees/{employee_id}/salary/bank-info
 * Access: CEO, HR only (Employee and Manager access denied)
 * @returns Mutation object with delete function and state
 */
export function useDeleteBankInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employee_id: string) => BankInfoService.delete(employee_id),
    onSuccess: async (_, employee_id) => {
      // Remove bank info from cache (soft-deleted, no longer visible)
      await queryClient.removeQueries({
        queryKey: ["bankInfo", employee_id],
      });
    },
  });
}


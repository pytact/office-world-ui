// Salary Hooks
// F-006: Salary & History Management
// React Query hooks for salary operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { SalaryService } from "@/services/salary.service";
import {
  SalaryCreate,
  SalaryRevise,
} from "@/utils/types/requests/salary";

/**
 * Hook for getting active salary for an employee
 * GET /v1/company/employees/{employee_id}/salary
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: 404 responses are treated as "no active salary exists" (not an error)
 * @param employee_id - Employee ID (UUID)
 * @returns Query object with active salary data and state
 */
export function useGetActiveSalary(employee_id: string | null) {
  return useQuery({
    queryKey: ["salary", "active", employee_id],
    queryFn: async () => {
      if (!employee_id) {
        throw new Error("Employee ID is required");
      }
      
      try {
        return await SalaryService.getActive(employee_id);
      } catch (error: any) {
        // Handle 404 as "no active salary exists" - not an error
        // This is expected when an employee hasn't been assigned a salary yet
        if (error?.statusCode === 404 || error?.response?.status === 404) {
          // Return a response structure with null data to match the expected type
          return { data: null } as any;
        }
        // Re-throw other errors
        throw error;
      }
    },
    enabled: !!employee_id, // Only run query if employee_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - salary details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (no active salary exists)
      if (error?.statusCode === 404 || error?.response?.status === 404) {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    },
  });
}

/**
 * Hook for getting salary history for an employee
 * GET /v1/company/employees/{employee_id}/salary/history
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: Returns array (not paginated), sorted by created_at descending
 * @param employee_id - Employee ID (UUID)
 * @returns Query object with salary history data and state
 */
export function useGetSalaryHistory(employee_id: string | null) {
  return useQuery({
    queryKey: ["salary", "history", employee_id],
    queryFn: () => {
      if (!employee_id) {
        throw new Error("Employee ID is required");
      }
      return SalaryService.getHistory(employee_id);
    },
    enabled: !!employee_id, // Only run query if employee_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - history is immutable, rarely changes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // History doesn't change, no need to refetch
  });
}

/**
 * Hook for creating initial salary for an employee
 * POST /v1/company/employees/{employee_id}/salary
 * Access: CEO, HR only (Employee and Manager access denied)
 * @returns Mutation object with create function and state
 */
export function useCreateSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
    }: {
      employee_id: string;
      payload: SalaryCreate;
    }) => SalaryService.create(employee_id, payload),
    onSuccess: async (_, variables) => {
      // Invalidate active salary query
      await queryClient.invalidateQueries({
        queryKey: ["salary", "active", variables.employee_id],
      });
      // Invalidate salary history (new entry may be created)
      await queryClient.invalidateQueries({
        queryKey: ["salary", "history", variables.employee_id],
      });
    },
  });
}

/**
 * Hook for revising salary (increment/change)
 * POST /v1/company/employees/{employee_id}/salary/revise
 * Access: CEO, HR only (Employee and Manager access denied)
 * Note: Requires If-Match header with ETag from GET active salary response
 * @returns Mutation object with revise function and state
 */
export function useReviseSalary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
      etag,
    }: {
      employee_id: string;
      payload: SalaryRevise;
      etag?: string;
    }) => SalaryService.revise(employee_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate active salary query
      await queryClient.invalidateQueries({
        queryKey: ["salary", "active", variables.employee_id],
      });
      // Invalidate salary history (new entry is created)
      await queryClient.invalidateQueries({
        queryKey: ["salary", "history", variables.employee_id],
      });
    },
  });
}


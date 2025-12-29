// Employee Hooks
// F-005: Employee Management
// React Query hooks for employee operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { EmployeeService } from "@/services/employee.service";
import {
  EmployeeUpdate,
  EmployeeListParams,
} from "@/utils/types/requests/employee";

/**
 * Hook for listing employees with pagination, search, filtering, and sorting
 * GET /api/v1/company/employees
 * Access: CEO, HR, Manager (Employee role returns 403, SuperAdmin returns 403)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with employee list data and state
 */
export function useListEmployees(params?: EmployeeListParams) {
  return useQuery({
    queryKey: [
      "employees",
      params?.page,
      params?.page_size,
      params?.search,
      params?.department,
      params?.employment_status,
      params?.role_code,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => EmployeeService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single employee by ID
 * GET /api/v1/company/employees/{employee_id}
 * Access: CEO, HR, Manager (Employee role returns 403, SuperAdmin returns 403)
 * @param employee_id - Employee ID (UUID)
 * @returns Query object with employee data and state
 */
export function useGetEmployee(employee_id: string | null) {
  return useQuery({
    queryKey: ["employee", employee_id],
    queryFn: () => {
      if (!employee_id) {
        throw new Error("Employee ID is required");
      }

      return EmployeeService.getById(employee_id);
    },
    enabled: !!employee_id, // Only run query if employee_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - employee details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for updating employee fields including activation/deactivation
 * PATCH /api/v1/company/employees/{employee_id}
 * Access: CEO, HR only (Manager, Employee, SuperAdmin return 403)
 * Note: Requires If-Match header with ETag for concurrency control
 * @returns Mutation object with update function and state
 */
export function useUpdateEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      payload,
      etag,
    }: {
      employee_id: string;
      payload: EmployeeUpdate;
      etag?: string;
    }) => EmployeeService.update(employee_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate employee list
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Invalidate specific employee
      await queryClient.invalidateQueries({
        queryKey: ["employee", variables.employee_id],
      });
    },
  });
}

/**
 * Hook for soft deleting an employee
 * DELETE /api/v1/employees/{employee_id}
 * Access: CEO, HR only (Manager, Employee, SuperAdmin return 403)
 * Note: Requires If-Match header with ETag for concurrency control
 * Note: DELETE endpoint uses /api/v1/employees/{employee_id} path (no /company prefix)
 * @returns Mutation object with delete function and state
 */
export function useDeleteEmployee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employee_id,
      etag,
    }: {
      employee_id: string;
      etag?: string;
    }) => EmployeeService.delete(employee_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate employee list
      await queryClient.invalidateQueries({ queryKey: ["employees"] });
      // Remove specific employee from cache (soft-deleted, no longer visible)
      await queryClient.removeQueries({
        queryKey: ["employee", variables.employee_id],
      });
    },
  });
}


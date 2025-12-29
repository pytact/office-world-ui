// Leave Hooks
// F-009: Leave Management
// React Query hooks for leave operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { LeaveService } from "@/services/leave.service";
import {
  LeaveCreate,
  LeaveAction,
  LeaveListParams,
} from "@/utils/types/requests/leave";

/**
 * Hook for listing leave requests with pagination, filtering, and sorting
 * GET /api/v1/company/leaves
 * Visibility is role-based:
 * - Employee: Own leave requests only
 * - Manager: Leave requests assigned to them for approval
 * - HR/CEO: All company leave requests
 * - SuperAdmin: All companies (requires company context)
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with leave list data and state
 */
export function useListLeaves(params?: LeaveListParams) {
  return useQuery({
    queryKey: [
      "leaves",
      params?.page,
      params?.page_size,
      params?.status,
      params?.start_date,
      params?.end_date,
      params?.employee_id,
      params?.pending_for_me,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => LeaveService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single leave request by ID
 * GET /api/v1/company/leaves/{leave_id}
 * Access is based on visibility rules:
 * - Employee: Own leave requests only
 * - Manager: Leave requests assigned to them
 * - HR/CEO: All company leave requests
 * Supports ETag-based cache validation with If-None-Match header
 * @param leave_id - Leave request ID (UUID)
 * @returns Query object with leave data and state
 */
export function useGetLeave(leave_id: string | null) {
  return useQuery({
    queryKey: ["leave", leave_id],
    queryFn: () => {
      if (!leave_id) {
        const error = new Error("Leave ID is required");
        throw error;
      }

      return LeaveService.getById(leave_id);
    },
    enabled: !!leave_id, // Only run query if leave_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - leave details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating a new leave request
 * POST /api/v1/company/leaves
 * Requires manager_approver_id and hr_approver_id (both must be in same company)
 * Validates overlapping leave requests, non-working days, and employee active status
 * Only active employees can create leave requests
 * Triggers notification to manager approver and HR approver
 * @returns Mutation object with create function and state
 */
export function useCreateLeave() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LeaveCreate) => LeaveService.create(payload),
    onSuccess: async (data) => {
      // Invalidate leave list (new leave affects list display)
      await queryClient.invalidateQueries({ queryKey: ["leaves"] });
      // Invalidate specific leave if we have the ID
      if (data?.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["leave", data.data.id],
        });
      }
    },
  });
}

/**
 * Hook for performing leave workflow actions (approve, reject, cancel)
 * POST /api/v1/company/leaves/{leave_id}/action
 * This is the workflow update operation (not a traditional update)
 * 
 * Authorization:
 * - Employee: Can cancel own pending leave requests
 * - Manager: Can approve/reject assigned employee leave requests at manager stage
 * - HR: Can approve/reject employee/manager leave requests at HR stage
 * - CEO: Can approve/reject HR leave requests at CEO stage
 * - Cannot approve/reject own leave requests
 * 
 * Requires If-Match header (ETag) for concurrency control
 * Triggers notifications on approve/reject/cancel
 * @returns Mutation object with action function and state
 */
export function useLeaveAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leave_id,
      payload,
      etag,
    }: {
      leave_id: string;
      payload: LeaveAction;
      etag?: string;
    }) => LeaveService.action(leave_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate leave list (status changes affect list display and visibility)
      await queryClient.invalidateQueries({ queryKey: ["leaves"] });
      // Invalidate specific leave (workflow state has changed)
      await queryClient.invalidateQueries({
        queryKey: ["leave", variables.leave_id],
      });
    },
  });
}

/**
 * Hook for updating a leave request
 * Note: This operation is NOT supported by the Leave Management API.
 * Leave requests cannot be edited after submission (per business rules).
 * Use useLeaveAction() hook for workflow operations (approve/reject/cancel).
 * 
 * @returns Mutation object that always throws an error
 */
export function useUpdateLeave() {
  return useMutation({
    mutationFn: async () => {
      throw new Error(
        "Leave requests cannot be updated after submission. Use useLeaveAction() hook for workflow operations (approve/reject/cancel)."
      );
    },
  });
}

/**
 * Hook for deleting a leave request
 * Note: This operation is NOT supported by the Leave Management API.
 * Leave requests cannot be deleted (workflow-based system).
 * Use useLeaveAction() hook with "cancel" action to cancel pending leave requests.
 * 
 * @returns Mutation object that always throws an error
 */
export function useDeleteLeave() {
  return useMutation({
    mutationFn: async () => {
      throw new Error(
        "Leave requests cannot be deleted. Use useLeaveAction() hook with 'cancel' action to cancel pending leave requests."
      );
    },
  });
}


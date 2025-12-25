// Task Hooks
// F-008: Task Management & Assignment
// React Query hooks for task operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { TaskService } from "@/services/task.service";
import {
  TaskCreate,
  TaskUpdate,
  TaskListParams,
} from "@/utils/types/requests/task";

/**
 * Hook for listing tasks with pagination, filtering, search, and sorting
 * GET /api/v1/company/tasks
 * Visibility is role-based: CEO/Manager see all, HR sees all (read-only), Employees see own/assigned only
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with task list data and state
 */
export function useListTasks(params?: TaskListParams) {
  return useQuery({
    queryKey: [
      "tasks",
      params?.page,
      params?.page_size,
      params?.status,
      params?.project_id,
      params?.search,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => TaskService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single task by ID
 * GET /api/v1/company/tasks/{task_id}
 * Access is based on visibility rules: owner, assignee, or CEO/Manager/HR roles
 * @param task_id - Task ID (UUID)
 * @returns Query object with task data and state
 */
export function useGetTask(task_id: string | null) {
  return useQuery({
    queryKey: ["task", task_id],
    queryFn: () => {
      if (!task_id) {
        const error = new Error("Task ID is required");
        // R15: No console.logs in production - removed debug logging
        throw error;
      }

      return TaskService.getById(task_id);
    },
    enabled: !!task_id, // Only run query if task_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - task details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating a new task
 * POST /api/v1/company/tasks
 * Task owner is automatically set to authenticated user (immutable)
 * Initial status must be TODO
 * Only CEO, Manager, and Employee can create tasks (HR blocked by RBAC)
 * @returns Mutation object with create function and state
 */
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TaskCreate) => TaskService.create(payload),
    onSuccess: async (data) => {
      // Invalidate task list
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Invalidate specific task if we have the ID
      if (data?.data?.task_id) {
        await queryClient.invalidateQueries({
          queryKey: ["task", data.data.task_id],
        });
      }
    },
  });
}

/**
 * Hook for updating task details (name, description, status, assignments)
 * PATCH /api/v1/company/tasks/{task_id}
 * Field-specific authorization:
 * - Name/Description: Owner, Editor, CEO, Manager
 * - Status: Owner only
 * - Assignments: Owner, CEO, Manager
 * Requires If-Match header (ETag) for concurrency control
 * @returns Mutation object with update function and state
 */
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      task_id,
      payload,
      etag,
    }: {
      task_id: string;
      payload: TaskUpdate;
      etag?: string;
    }) => TaskService.update(task_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate task list (changes affect list display and visibility)
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Invalidate specific task
      await queryClient.invalidateQueries({
        queryKey: ["task", variables.task_id],
      });
    },
  });
}

/**
 * Hook for deleting a task (hard delete, permanent removal)
 * DELETE /api/v1/company/tasks/{task_id}
 * Task owner, CEO, and Manager can delete tasks
 * Requires If-Match header (ETag) for concurrency control
 * @returns Mutation object with delete function and state
 */
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      task_id,
      etag,
    }: {
      task_id: string;
      etag?: string;
    }) => TaskService.delete(task_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate task list
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Remove specific task from cache (it no longer exists)
      await queryClient.removeQueries({
        queryKey: ["task", variables.task_id],
      });
    },
  });
}


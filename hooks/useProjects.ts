// Project Hooks
// F-007: Project Management
// React Query hooks for project operations with caching
// Following R5 (Custom Hooks) and R9 (Caching) rules

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { ProjectService } from "@/services/project.service";
import {
  ProjectCreate,
  ProjectUpdate,
  ProjectListParams,
} from "@/utils/types/requests/project";

/**
 * Hook for listing projects with pagination, filtering, search, and sorting
 * GET /api/v1/company/projects
 * Visibility is role-based: CEO/Manager/HR see all company projects; Employees see only projects with assigned tasks
 * @param params - Query parameters for filtering, sorting, and pagination
 * @returns Query object with project list data and state
 */
export function useListProjects(params?: ProjectListParams) {
  return useQuery({
    queryKey: [
      "projects",
      params?.page,
      params?.page_size,
      params?.status,
      params?.search,
      params?.sort_by,
      params?.sort_order,
    ],
    queryFn: () => ProjectService.list(params),
    staleTime: 30 * 1000, // 30 seconds - list data changes frequently
    gcTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: keepPreviousData, // Smooth pagination transitions
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook for getting a single project by ID
 * GET /api/v1/company/projects/{project_id}
 * Employees can only access projects where they have assigned tasks
 * @param project_id - Project ID (UUID)
 * @returns Query object with project data and state
 */
export function useGetProject(project_id: string | null) {
  return useQuery({
    queryKey: ["project", project_id],
    queryFn: () => {
      if (!project_id) {
        const error = new Error("Project ID is required");
        if (process.env.NODE_ENV === "development") {
          console.error("[useGetProject] Project ID is missing");
        }
        throw error;
      }

      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("[useGetProject] Fetching project:", project_id);
      }

      return ProjectService.getById(project_id);
    },
    enabled: !!project_id, // Only run query if project_id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes - project details are relatively stable
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: true, // Refetch when window regains focus for fresh data
  });
}

/**
 * Hook for creating a new project
 * POST /api/v1/company/projects
 * Only CEO and Manager can create projects
 * @returns Mutation object with create function and state
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectCreate) => ProjectService.create(payload),
    onSuccess: async (data) => {
      // Invalidate project list
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Invalidate specific project if we have the ID
      if (data?.data?.id) {
        await queryClient.invalidateQueries({
          queryKey: ["project", data.data.id],
        });
      }
    },
  });
}

/**
 * Hook for updating project name and/or status
 * PATCH /api/v1/company/projects/{project_id}
 * Only CEO and Manager can update projects
 * Requires If-Match header (ETag) for concurrency control
 * @returns Mutation object with update function and state
 */
export function useUpdateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      project_id,
      payload,
      etag,
    }: {
      project_id: string;
      payload: ProjectUpdate;
      etag?: string;
    }) => ProjectService.update(project_id, payload, etag),
    onSuccess: async (_, variables) => {
      // Invalidate project list
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Invalidate specific project
      await queryClient.invalidateQueries({
        queryKey: ["project", variables.project_id],
      });
    },
  });
}

/**
 * Hook for deleting a project (soft delete with cascade to tasks)
 * DELETE /api/v1/company/projects/{project_id}
 * Only CEO and Manager can delete projects
 * Requires If-Match header (ETag) for concurrency control
 * @returns Mutation object with delete function and state
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      project_id,
      etag,
    }: {
      project_id: string;
      etag?: string;
    }) => ProjectService.delete(project_id, etag),
    onSuccess: async (_, variables) => {
      // Invalidate project list
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
      // Remove specific project from cache (it no longer exists)
      await queryClient.removeQueries({
        queryKey: ["project", variables.project_id],
      });
    },
  });
}


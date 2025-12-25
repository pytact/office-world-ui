// Task Service
// F-008: Task Management & Assignment
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  TaskCreate,
  TaskUpdate,
  TaskListParams,
} from "@/utils/types/requests/task";

import {
  TaskListResponse,
  TaskDetailResponse,
  TaskMutationResponse,
} from "@/utils/types/responses/task";

const basePath = "/v1/company/tasks";

export const TaskService = {
  /**
   * GET /api/v1/company/tasks
   * List tasks with pagination, filtering, search, and sorting
   * Visibility is role-based: CEO/Manager see all, HR sees all (read-only), Employees see own/assigned only
   */
  list: async (params?: TaskListParams): Promise<TaskListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.project_id) {
        searchParams.append("project_id", params.project_id);
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = queryString ? `${basePath}?${queryString}` : basePath;

      const r = await http.get<TaskListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/tasks/{task_id}
   * Get task details with assignments, project info, and derived permission fields
   * Access is based on visibility rules: owner, assignee, or CEO/Manager/HR roles
   */
  getById: async (task_id: string): Promise<TaskDetailResponse> => {
    try {
      const r = await http.get<TaskDetailResponse>(`${basePath}/${task_id}`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/company/tasks
   * Create a new task
   * Task owner is automatically set to authenticated user (immutable)
   * Initial status must be TODO
   * Only CEO, Manager, and Employee can create tasks (HR blocked by RBAC)
   */
  create: async (payload: TaskCreate): Promise<TaskMutationResponse> => {
    try {
      const r = await http.post<TaskMutationResponse>(basePath, payload);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/company/tasks/{task_id}
   * Consolidated update task details (name, description, status, assignments)
   * Field-specific authorization:
   * - Name/Description: Owner, Editor, CEO, Manager
   * - Status: Owner only
   * - Assignments: Owner, CEO, Manager
   * Requires If-Match header (ETag) for concurrency control
   */
  update: async (
    task_id: string,
    payload: TaskUpdate,
    etag?: string
  ): Promise<TaskMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<TaskMutationResponse>(
        `${basePath}/${task_id}`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * DELETE /api/v1/company/tasks/{task_id}
   * Hard delete task (permanent removal)
   * Task owner, CEO, and Manager can delete tasks
   * Requires If-Match header (ETag) for concurrency control
   */
  delete: async (task_id: string, etag?: string): Promise<void> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      await http.delete(`${basePath}/${task_id}`, {
        headers,
      });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


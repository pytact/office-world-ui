// Project Service
// F-007: Project Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  ProjectCreate,
  ProjectUpdate,
  ProjectListParams,
} from "@/utils/types/requests/project";

import {
  ProjectListResponse,
  ProjectDetailResponse,
  ProjectMutationResponse,
} from "@/utils/types/responses/project";

const basePath = "/v1/company/projects";

export const ProjectService = {
  /**
   * GET /api/v1/company/projects
   * List projects with pagination, filtering, search, and sorting
   * Visibility is role-based: CEO/Manager/HR see all company projects; Employees see only projects with assigned tasks
   */
  list: async (
    params?: ProjectListParams
  ): Promise<ProjectListResponse> => {
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

      const r = await http.get<ProjectListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/projects/{project_id}
   * Get project detail including task summaries
   * Employees can only access projects where they have assigned tasks
   */
  getById: async (
    project_id: string
  ): Promise<ProjectDetailResponse> => {
    try {
      const r = await http.get<ProjectDetailResponse>(
        `${basePath}/${project_id}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/company/projects
   * Create a new project within the user's company
   * Only CEO and Manager can create projects
   */
  create: async (
    payload: ProjectCreate
  ): Promise<ProjectMutationResponse> => {
    try {
      const r = await http.post<ProjectMutationResponse>(
        basePath,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/company/projects/{project_id}
   * Update project name and/or status
   * Only CEO and Manager can update projects
   * Requires If-Match header (ETag) for concurrency control
   */
  update: async (
    project_id: string,
    payload: ProjectUpdate,
    etag?: string
  ): Promise<ProjectMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<ProjectMutationResponse>(
        `${basePath}/${project_id}`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * DELETE /api/v1/company/projects/{project_id}
   * Delete a project using soft delete (IsDeleted marker)
   * Cascades soft delete to all associated tasks
   * Only CEO and Manager can delete projects
   * Requires If-Match header (ETag) for concurrency control
   */
  delete: async (
    project_id: string,
    etag?: string
  ): Promise<void> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      await http.delete(`${basePath}/${project_id}`, {
        headers,
      });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


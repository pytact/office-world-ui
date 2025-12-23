// Permission Service
// F-002: RBAC & Permission Engine
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

import {
  PermissionListParams,
  PermissionCreate,
  PermissionUpdate,
} from "@/utils/types/requests/permission";

import {
  PermissionResponse,
  PermissionListResponse,
  PermissionMutationResponse,
} from "@/utils/types/responses/permission";

const basePath = "/v1/auth";

export const PermissionService = {
  /**
   * GET /api/v1/auth/me
   * Retrieve current user's permissions and context
   * 
   * This is the ONLY endpoint supported by F-002.
   * Returns combined PermissionSet and AuthContext for the authenticated user.
   * 
   * Note: No path parameters, query parameters, or request body required.
   * Permission data is always resolved in the context of the authenticated user.
   */
  get: async (): Promise<PermissionResponse> => {
    try {
      const r = await http.get<PermissionResponse>(`${basePath}/me`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * List permissions
   * 
   * NOTE: F-002 does NOT support list operations.
   * GET /api/v1/auth/me returns user-specific data (no list endpoint).
   * Permissions are not listable resources.
   * 
   * This method exists for R8 structure compliance only.
   * It will throw an error indicating the operation is not supported.
   */
  list: async (
    params?: PermissionListParams
  ): Promise<PermissionListResponse> => {
    try {
      // This operation is not supported by F-002 API
      throw new Error(
        "List operation is not supported for permissions. Use PermissionService.get() to retrieve current user's permissions."
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Get permission by ID
   * 
   * NOTE: F-002 does NOT support getById operations.
   * Permissions are not resources with IDs.
   * GET /api/v1/auth/me returns the current user's permissions (no ID needed).
   * 
   * This method exists for R8 structure compliance only.
   * It will throw an error indicating the operation is not supported.
   */
  getById: async (id: string): Promise<PermissionResponse> => {
    try {
      // This operation is not supported by F-002 API
      throw new Error(
        "GetById operation is not supported for permissions. Use PermissionService.get() to retrieve current user's permissions."
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Create permission
   * 
   * NOTE: F-002 does NOT support create operations.
   * Permissions are predefined and stored in the roles table.
   * Role inheritance is resolved at seed time, not runtime.
   * Permissions cannot be created via API.
   * 
   * Permission changes occur indirectly through:
   * - Role assignment changes (F-001)
   * - User activation status changes (F-001)
   * - Company reassignment (F-001)
   * - Company deactivation (F-004)
   * 
   * This method exists for R8 structure compliance only.
   * It will throw an error indicating the operation is not supported.
   */
  create: async (
    payload: PermissionCreate
  ): Promise<PermissionMutationResponse> => {
    try {
      // This operation is not supported by F-002 API
      throw new Error(
        "Create operation is not supported for permissions. Permissions are predefined and cannot be created via API."
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Update permission
   * 
   * NOTE: F-002 does NOT support update operations.
   * Permissions are immutable and predefined.
   * Permission changes occur indirectly through:
   * - Role assignment changes (F-001)
   * - User activation status changes (F-001)
   * - Company reassignment (F-001)
   * - Company deactivation (F-004)
   * 
   * This method exists for R8 structure compliance only.
   * It will throw an error indicating the operation is not supported.
   */
  update: async (
    id: string,
    payload: PermissionUpdate
  ): Promise<PermissionMutationResponse> => {
    try {
      // This operation is not supported by F-002 API
      throw new Error(
        "Update operation is not supported for permissions. Permissions are immutable and cannot be updated via API."
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * Delete permission
   * 
   * NOTE: F-002 does NOT support delete operations.
   * Permissions are predefined and cannot be deleted via API.
   * Permission changes occur indirectly through:
   * - Role assignment changes (F-001)
   * - User activation status changes (F-001)
   * - Company reassignment (F-001)
   * - Company deactivation (F-004)
   * 
   * This method exists for R8 structure compliance only.
   * It will throw an error indicating the operation is not supported.
   */
  delete: async (id: string): Promise<void> => {
    try {
      // This operation is not supported by F-002 API
      throw new Error(
        "Delete operation is not supported for permissions. Permissions are predefined and cannot be deleted via API."
      );
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


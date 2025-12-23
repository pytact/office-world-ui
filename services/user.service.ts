// User Service
// F-001: User & Role Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  UserInviteCreate,
  UserUpdate,
  UserRoleChange,
  UserCompanyReassign,
  UserStatusUpdate,
  UserDeactivate,
  UserReactivate,
  UserResendInvite,
  UserPlatformListParams,
  UserCompanyListParams,
} from "@/utils/types/requests/user";

import {
  UserPlatformListResponse,
  UserCompanyListResponse,
  UserDetailResponse,
  UserInviteMutationResponse,
  UserUpdateMutationResponse,
  UserRoleChangeMutationResponse,
  UserCompanyReassignMutationResponse,
  UserStatusUpdateMutationResponse,
  UserDeactivateMutationResponse,
  UserReactivateMutationResponse,
  UserResendInviteMutationResponse,
  RoleListResponse,
  CompanyListResponse,
} from "@/utils/types/responses/user";

const basePath = "/v1";

export const UserService = {
  /**
   * GET /api/v1/users
   * List all users across platform (SuperAdmin only)
   */
  list: async (
    params?: UserPlatformListParams
  ): Promise<UserPlatformListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.company_slug) {
        searchParams.append("company_slug", params.company_slug);
      }
      if (params?.role_code) {
        searchParams.append("role_code", params.role_code);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = `${basePath}/users${queryString ? `?${queryString}` : ""}`;

      const r = await http.get<UserPlatformListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/companies/{company_id}/users
   * List users within company (SuperAdmin, CEO, HR, Manager)
   */
  listCompany: async (
    company_id: string,
    params?: UserCompanyListParams
  ): Promise<UserCompanyListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.role_code) {
        searchParams.append("role_code", params.role_code);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = `${basePath}/companies/${company_id}/users${queryString ? `?${queryString}` : ""}`;

      const r = await http.get<UserCompanyListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/users/{user_id}
   * Get user by ID
   */
  getById: async (user_id: string): Promise<UserDetailResponse> => {
    try {
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("[UserService] Fetching user by ID:", user_id);
        console.log("[UserService] API URL:", `${basePath}/users/${user_id}`);
      }

      const r = await http.get<UserDetailResponse>(`${basePath}/users/${user_id}`);
      
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("[UserService] User response received:", {
          status: r.status,
          data: r.data,
        });
      }

      return r.data;
    } catch (error) {
      // Enhanced error logging
      if (process.env.NODE_ENV === "development") {
        console.error("[UserService] Error fetching user:", error);
      }
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/users/invite
   * Invite a new user with role and company assignment
   */
  create: async (
    payload: UserInviteCreate
  ): Promise<UserInviteMutationResponse> => {
    try {
      console.log("[UserService] create called with payload:", payload);
      console.log("[UserService] Making POST request to:", `${basePath}/users/invite`);
      const r = await http.post<UserInviteMutationResponse>(
        `${basePath}/users/invite`,
        payload
      );
      console.log("[UserService] API response:", r);
      return r.data;
    } catch (error) {
      console.error("[UserService] API error:", error);
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/users/{user_id}
   * Update user information (name, etc.)
   * Requires If-Match header with ETag for concurrency control
   */
  update: async (
    user_id: string,
    payload: UserUpdate,
    etag?: string
  ): Promise<UserUpdateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserUpdateMutationResponse>(
        `${basePath}/users/${user_id}`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/users/{user_id}/role
   * Change user role within the same company
   * Requires If-Match header with ETag for concurrency control
   */
  changeRole: async (
    user_id: string,
    payload: UserRoleChange,
    etag?: string
  ): Promise<UserRoleChangeMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserRoleChangeMutationResponse>(
        `${basePath}/users/${user_id}/role`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/users/{user_id}/companies/{company_id}/reassign
   * Reassign user to different company with optional role change (SuperAdmin only)
   * Requires If-Match header with ETag for concurrency control
   */
  reassignCompany: async (
    user_id: string,
    company_id: string,
    payload: UserCompanyReassign,
    etag?: string
  ): Promise<UserCompanyReassignMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserCompanyReassignMutationResponse>(
        `${basePath}/users/${user_id}/companies/${company_id}/reassign`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/users/{user_id}/status
   * Update user status (activate/deactivate)
   * Requires user_id and status in payload, ETag in header for concurrency control
   */
  updateStatus: async (
    user_id: string,
    payload: UserStatusUpdate,
    etag?: string
  ): Promise<UserStatusUpdateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserStatusUpdateMutationResponse>(
        `${basePath}/users/${user_id}/status`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * @deprecated Use updateStatus instead
   * PATCH /api/v1/users/{user_id}/deactivate
   * Deactivate user (set is_active=false, blocks authentication)
   * Requires If-Match header with ETag for concurrency control
   */
  deactivate: async (
    user_id: string,
    etag?: string
  ): Promise<UserDeactivateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserDeactivateMutationResponse>(
        `${basePath}/users/${user_id}/deactivate`,
        {},
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * @deprecated Use updateStatus instead
   * PATCH /api/v1/users/{user_id}/reactivate
   * Reactivate user (set is_active=true, restores authentication)
   * Requires If-Match header with ETag for concurrency control
   */
  reactivate: async (
    user_id: string,
    etag?: string
  ): Promise<UserReactivateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<UserReactivateMutationResponse>(
        `${basePath}/users/${user_id}/reactivate`,
        {},
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/users/{user_id}/resend-invite
   * Resend invitation to user (generates new token and expiry)
   * Note: Does not require ETag (action endpoint, not resource update)
   */
  resendInvite: async (
    user_id: string
  ): Promise<UserResendInviteMutationResponse> => {
    try {
      const r = await http.post<UserResendInviteMutationResponse>(
        `${basePath}/users/${user_id}/resend-invite`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/roles
   * List available roles for invitation form dropdown
   * Accessible by SuperAdmin, CEO, HR
   */
  getRoles: async (): Promise<RoleListResponse> => {
    try {
      const r = await http.get<RoleListResponse>(`${basePath}/roles`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/companies
   * List all companies for SuperAdmin invitation form
   * SuperAdmin only
   */
  getCompanies: async (): Promise<CompanyListResponse> => {
    try {
      const r = await http.get<CompanyListResponse>(`${basePath}/companies`);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};

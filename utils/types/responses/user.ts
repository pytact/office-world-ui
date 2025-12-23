// Response types for F-001: User & Role Management
// Following R3 rules: Entity Response, List Response, Mutation Response, Error Response
// All field names match API spec exactly (snake_case, no renaming)

/**
 * Role entity response (nested in User)
 * GET /api/v1/roles
 */
export interface RoleResponse {
  id: string; // UUID - role identifier (used as role_id in requests)
  code: string;
  name: string;
}

/**
 * Company entity response (nested in User)
 * GET /api/v1/companies
 */
export interface CompanyResponse {
  company_id: string;
  name: string;
  slug: string;
  is_active?: boolean;
}

/**
 * User entity response
 * GET /api/v1/users/{user_id}
 * Matches API response structure exactly
 */
export interface UserResponse {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_deleted?: boolean;
  invite_at: string;
  activate_at: string | null;
  expiry: string;
  reinvite_count?: number;
  last_reinvite_at?: string | null;
  invitation_status?: "pending" | "expired" | "activated";
  can_resend_invite?: boolean;
  role: RoleResponse;
  company: CompanyResponse | null;
  updated_at?: string; // ISO 8601 timestamp - used for ETag generation
}

/**
 * User list item response (used in paginated lists)
 * Reduced field set for list views
 * GET /api/v1/users, GET /api/v1/companies/{company_id}/users
 */
export interface UserListItemResponse {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_deleted?: boolean;
  invite_at?: string;
  activate_at?: string | null;
  expiry?: string;
  invitation_status?: "pending" | "expired" | "activated";
  role: RoleResponse;
  company?: CompanyResponse | null;
}

/**
 * Pagination metadata for list responses
 * Matches API response structure exactly
 */
export interface UserListPaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * User list response data structure
 * Contains items array and pagination metadata
 */
export interface UserListData {
  items: UserListItemResponse[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * GET /api/v1/users
 * Platform user list response (SuperAdmin only)
 */
export interface UserPlatformListResponse {
  data: UserListData;
  message: string;
}

/**
 * GET /api/v1/company/users
 * Company user list response (SuperAdmin, CEO, HR, Manager)
 */
export interface UserCompanyListResponse {
  data: UserListData;
  message: string;
}

/**
 * GET /api/v1/users/{user_id}
 * Single user detail response
 */
export interface UserDetailResponse {
  data: UserResponse;
  message: string;
}

/**
 * GET /api/v1/roles
 * Role list response (not paginated)
 */
export interface RoleListResponse {
  data: {
    items: RoleResponse[];
  };
  message: string;
}

/**
 * GET /api/v1/companies
 * Company list response (not paginated, SuperAdmin only)
 */
export interface CompanyListResponse {
  data: {
    items: CompanyResponse[];
  };
  message: string;
}

/**
 * POST /api/v1/users/invite
 * Mutation response for user invitation
 */
export interface UserInviteMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * PATCH /api/v1/users/{user_id}
 * Mutation response for user update
 */
export interface UserUpdateMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * PATCH /api/v1/users/{user_id}/role
 * Mutation response for role change
 */
export interface UserRoleChangeMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * PATCH /api/v1/users/{user_id}/companies/{company_id}/reassign
 * Mutation response for company reassignment
 */
export interface UserCompanyReassignMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * PATCH /api/v1/users/{user_id}/status
 * Mutation response for user status update (activate/deactivate)
 */
export interface UserStatusUpdateMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * @deprecated Use UserStatusUpdateMutationResponse instead
 * PATCH /api/v1/users/{user_id}/deactivate
 * Mutation response for user deactivation
 */
export interface UserDeactivateMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * @deprecated Use UserStatusUpdateMutationResponse instead
 * PATCH /api/v1/users/{user_id}/reactivate
 * Mutation response for user reactivation
 */
export interface UserReactivateMutationResponse {
  data: UserResponse;
  message: string;
}

/**
 * POST /api/v1/users/{user_id}/resend-invite
 * Mutation response for resending invitation
 */
export interface UserResendInviteMutationResponse {
  data: UserResponse;
  message: string;
}

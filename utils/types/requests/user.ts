// Request types for F-001: User & Role Management
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Base user request interface
 * Common fields shared across user operations
 */
export interface UserBase {
  email: string;
  role_code?: string; // Optional, may use role_id instead
  role_id?: string; // Optional, may use role_code instead
}

/**
 * POST /api/v1/users/invite
 * Request body for inviting a new user
 * Requires: email (required), role_id (required)
 * Adds: company_slug (optional)
 */
export interface UserInviteCreate {
  email: string;
  role_id: string; // UUID - required
  company_slug?: string | null;
}

/**
 * PATCH /api/v1/users/{user_id}
 * Request body for updating user information (name, password, etc.)
 * Note: Can update name only, password only, or both
 */
export interface UserUpdate {
  first_name?: string | null;
  last_name?: string | null;
  current_password?: string; // Required when changing password
  new_password?: string; // Required when changing password
}

/**
 * PATCH /api/v1/users/{user_id}/role
 * Request body for changing user role within the same company
 */
export interface UserRoleChange {
  role_id: string; // UUID - required
   // Optional, kept for backward compatibility
}

/**
 * PATCH /api/v1/users/{user_id}/companies/{company_id}/reassign
 * Request body for reassigning user to different company with optional role change
 * Note: Empty body {} allowed (keeps current role)
 */
export interface UserCompanyReassign {
  role_code?: string | null;
}

/**
 * PATCH /api/v1/users/{user_id}/status
 * Request body for updating user status (activate/deactivate)
 * Note: user_id and status are required in payload
 */
export interface UserStatusUpdate {
  user_id: string; // UUID - required
  status: "active" | "inactive"; // Required
}

/**
 * @deprecated Use UserStatusUpdate instead
 * PATCH /api/v1/users/{user_id}/deactivate
 * Request body for deactivating a user
 * Note: No request body required (empty object or no body)
 */
export interface UserDeactivate {
  // No fields - empty body
}

/**
 * @deprecated Use UserStatusUpdate instead
 * PATCH /api/v1/users/{user_id}/reactivate
 * Request body for reactivating a user
 * Note: No request body required (empty object or no body)
 */
export interface UserReactivate {
  // No fields - empty body
}

/**
 * POST /api/v1/users/{user_id}/resend-invite
 * Request body for resending invitation
 * Note: No request body required (empty object or no body)
 */
export interface UserResendInvite {
  // No fields - empty body
}

/**
 * GET /api/v1/users
 * Query parameters for platform user list (SuperAdmin only)
 * Note: page and page_size have defaults but are required in query
 */
export interface UserPlatformListParams {
  page?: number;
  page_size?: number;
  search?: string | null;
  company_slug?: string | null;
  role_code?: string | null;
  status?: "active" | "inactive" | "pending" | "expired" | "activated" | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

/**
 * GET /api/v1/company/users
 * Query parameters for company user list (SuperAdmin, CEO, HR, Manager)
 * Note: page and page_size have defaults but are required in query
 */
export interface UserCompanyListParams {
  page?: number;
  page_size?: number;
  search?: string | null;
  role_code?: string | null;
  status?: "active" | "inactive" | "pending" | "expired" | "activated" | null;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

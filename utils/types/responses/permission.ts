// Response types for F-002: RBAC & Permission Engine
// Following R3 rules: Entity Response, List Response, Mutation Response, Error Response
// All field names match API spec exactly (snake_case, no renaming)

/**
 * Permission Set
 * Represents resource-action permission mapping
 * GET /api/v1/auth/me - data.permissions
 * 
 * Structure: { [resource: string]: string[] }
 * Example: { "tasks": ["create", "read", "update", "delete"], "salary": ["read"] }
 * 
 * Note: Deactivated users receive empty object: {}
 * Note: Inactive companies result in empty object for company-scoped users
 */
export interface PermissionSet {
  [resource: string]: string[];
}

/**
 * Role entity response (nested in AuthContext)
 * GET /api/v1/auth/me - data.context.role
 * Matches API response structure exactly
 */
export interface RoleResponse {
  code: "superadmin" | "ceo" | "hr" | "manager" | "employee";
  name: string;
}

/**
 * Company entity response (nested in AuthContext)
 * GET /api/v1/auth/me - data.context.company
 * Matches API response structure exactly
 * 
 * Note: null for SuperAdmin users (entire object is null, not just slug)
 */
export interface CompanyResponse {
  slug: string;
}

/**
 * Auth Context response
 * GET /api/v1/auth/me - data.context
 * Represents contextual information about the authenticated user
 * Matches API response structure exactly
 */
export interface AuthContextResponse {
  user_id: string;
  role: RoleResponse;
  company: CompanyResponse | null;
  is_super_admin: boolean;
  is_user_active: boolean;
  is_company_active: boolean | null;
}

/**
 * Permission data response
 * GET /api/v1/auth/me - data
 * Contains PermissionSet and AuthContext
 * Matches API response structure exactly
 */
export interface PermissionDataResponse {
  permissions: PermissionSet;
  context: AuthContextResponse;
}

/**
 * Permission entity response
 * GET /api/v1/auth/me
 * Main response wrapper for permission endpoint
 * Matches API response structure exactly
 */
export interface PermissionResponse {
  data: PermissionDataResponse;
  message: string;
}

/**
 * Permission list response
 * 
 * NOTE: F-002 does NOT support list operations.
 * GET /api/v1/auth/me returns user-specific data (no list endpoint).
 * 
 * This interface exists for R3 structure compliance only.
 * No list endpoints exist for F-002.
 */
export interface PermissionListResponse {
  data: PermissionDataResponse[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Permission mutation response
 * 
 * NOTE: F-002 does NOT support mutation operations.
 * Permissions are read-only and cannot be created/updated via API.
 * Permission changes occur indirectly through:
 * - Role assignment changes (F-001)
 * - User activation status changes (F-001)
 * - Company reassignment (F-001)
 * - Company deactivation (F-004)
 * 
 * This interface exists for R3 structure compliance only.
 * No mutation endpoints exist for F-002.
 */
export interface PermissionMutationResponse {
  message: string;
  data?: PermissionDataResponse | null;
}

/**
 * API Error Response
 * 
 * Note: Error response structure is defined in common.ts
 * This export is for convenience and R3 compliance.
 * 
 * Error codes for F-002:
 * - UNAUTHENTICATED (401): Missing, invalid, or expired JWT token
 * - TOKEN_EXPIRED (401): JWT token has expired
 * - INVALID_TOKEN (401): Malformed token or missing required claims
 * - INSUFFICIENT_PERMISSIONS (403): User lacks required permissions (should not occur for GET /me)
 * - INTERNAL_ERROR (500): Server error during permission evaluation or cache retrieval
 */
export type { APIErrorResponse } from "./common";


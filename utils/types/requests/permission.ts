// Request types for F-002: RBAC & Permission Engine
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * IMPORTANT: F-002 is a READ-ONLY feature
 * 
 * F-002 (RBAC & Permission Engine) provides a centralized authorization layer
 * that evaluates permissions but does not support create, update, or list operations.
 * 
 * The only endpoint is:
 * - GET /api/v1/auth/me (no path params, no query params, no request body)
 * 
 * Permission data is always resolved in the context of the authenticated user.
 * No request payloads are required for F-002 endpoints.
 * 
 * Permission changes are triggered indirectly by other features (F-001, F-004):
 * - User role changes (F-001)
 * - User activation/deactivation (F-001)
 * - User company reassignment (F-001)
 * - Company deactivation (F-004)
 * 
 * These actions automatically invalidate permission cache and trigger
 * permission recomputation on the next GET /api/v1/auth/me request.
 */

/**
 * Base permission request interface
 * 
 * NOTE: F-002 has no base request fields as it is read-only.
 * This interface exists for R2 structure compliance and future extensibility.
 */
export interface PermissionBase {
  // No fields - F-002 is read-only
  // Permission data is resolved server-side from authenticated user context
}

/**
 * Permission create request interface
 * 
 * NOTE: F-002 does NOT support create operations.
 * Permissions are predefined and stored in the roles table.
 * Role inheritance is resolved at seed time, not runtime.
 * 
 * This interface exists for R2 structure compliance only.
 * No create endpoints exist for F-002.
 */
export interface PermissionCreate extends PermissionBase {
  // No fields - create operations not supported
  // Permissions cannot be created via API
}

/**
 * Permission update request interface
 * 
 * NOTE: F-002 does NOT support update operations.
 * Permissions are immutable and predefined.
 * Permission changes occur indirectly through:
 * - Role assignment changes (F-001)
 * - User activation status changes (F-001)
 * - Company reassignment (F-001)
 * - Company deactivation (F-004)
 * 
 * This interface exists for R2 structure compliance only.
 * No update endpoints exist for F-002.
 */
export interface PermissionUpdate {
  // No fields - update operations not supported
  // Permissions cannot be updated directly via API
}

/**
 * Permission list/filter parameters
 * 
 * NOTE: F-002 does NOT support list or filter operations.
 * GET /api/v1/auth/me has no query parameters.
 * Permission data is always resolved in the context of the authenticated user.
 * 
 * This interface exists for R2 structure compliance only.
 * No list/filter endpoints exist for F-002.
 */
export interface PermissionListParams {
  // No fields - list/filter operations not supported
  // GET /api/v1/auth/me has no query parameters
  // Permission data is user-specific and requires no filtering
}

/**
 * Permission status update request interface
 * 
 * NOTE: F-002 does NOT support status update operations.
 * Permission status is derived from:
 * - User activation status (is_user_active)
 * - Company activation status (is_company_active)
 * - Role assignment
 * 
 * These are managed by F-001 (User & Role Management) and F-004 (Company Management).
 * 
 * This interface exists for R2 structure compliance only.
 * No status update endpoints exist for F-002.
 */
export interface PermissionStatusUpdate {
  // No fields - status update operations not supported
  // Permission status is derived from user/company/role state
}


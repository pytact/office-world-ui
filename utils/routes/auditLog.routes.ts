// Audit Log Route Helpers
// F-011: Audit Logging & Activity History
// Route helper functions following R11 rules

/**
 * Audit log route helpers
 * Provides type-safe route generation
 * Following R11: Route structure for audit log feature
 * Note: Create/Edit routes not included as audit logs are read-only and immutable (per F-011 API spec)
 * Audit logs are system-generated only - UI never creates, edits, or deletes audit records
 */
export const auditLogRoutes = {
  // Company routes (CEO, HR, Manager only)
  // Employee and SuperAdmin are excluded (no access)
  company: {
    /**
     * List all audit logs for the company
     * Route: /company/audit-logs
     * Access: CEO, HR, Manager (with table_name restrictions for Manager)
     */
    list: "/company/audit-logs",

    /**
     * View detailed audit log information
     * Route: /company/audit-logs/:auditLogId
     * Access: CEO, HR, Manager (with table_name restrictions for Manager)
     * @param auditLogId - Audit log identifier (UUID format)
     */
    detail: (auditLogId: string) => `/company/audit-logs/${auditLogId}`,
  },
};


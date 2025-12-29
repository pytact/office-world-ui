// Leave Route Helpers
// F-009: Leave Management
// Route helper functions following R11 rules

/**
 * Leave management route helpers
 * Provides type-safe route generation
 * Following R11: 4-page structure (list, create, detail)
 * Note: Edit route is not included as leaves cannot be edited after submission (per F-009 API spec)
 */
export const leaveRoutes = {
  // Company routes
  company: {
    list: "/company/leaves",
    create: "/company/leaves/create",
    detail: (leaveId: string) => `/company/leaves/${leaveId}`,
    // Edit route not available - leaves cannot be edited after submission (F-009 API spec)
    approvals: "/company/leaves/approvals", // Approval queue for approvers
  },
};


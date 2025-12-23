// Company Route Helpers
// F-004: Platform Company Management
// Route helper functions following R11 rules

/**
 * Company management route helpers
 * Provides type-safe route generation
 */
export const companyRoutes = {
  // Platform routes (SuperAdmin only)
  platform: {
    list: "/platform/companies",
    create: "/platform/companies/create",
    detail: (companyId: string) => `/platform/companies/${companyId}`,
    edit: (companyId: string) => `/platform/companies/${companyId}/edit`,
    settings: (companyId: string) => `/platform/companies/${companyId}/settings`,
  },

  // Company profile route (CEO/HR only)
  profile: {
    view: "/company/profile",
  },
  // Company settings route (CEO/HR only)
  settings: {
    view: "/company/settings",
  },
};


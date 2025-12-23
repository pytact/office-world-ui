// User Route Helpers
// Route helper functions following R11 rules

/**
 * User management route helpers
 * Provides type-safe route generation
 */
export const userRoutes = {
  // Platform routes (SuperAdmin)
  platform: {
    list: "/platform/users",
    invite: "/platform/users/invite",
    detail: (id: string) => `/platform/users/${id}`,
    edit: (id: string) => `/platform/users/${id}/edit`,
  },

  // Company routes (CEO, HR, Manager)
  company: {
    list: "/company/users",
    invite: "/company/users/invite",
    detail: (id: string) => `/company/users/${id}`,
    edit: (id: string) => `/company/users/${id}/edit`,
  },

  // Shared routes
  shared: {
    invite: "/users/invite",
    detail: (id: string) => `/users/${id}`,
    edit: (id: string) => `/users/${id}/edit`,
  },

  // Universal profile route (all roles)
  profile: {
    view: "/me/profile",
  },
};


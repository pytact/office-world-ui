// Project Route Helpers
// F-007: Project Management
// Route helper functions following R11 rules

/**
 * Project management route helpers
 * Provides type-safe route generation
 */
export const projectRoutes = {
  // Company routes
  company: {
    list: "/company/projects",
    create: "/company/projects/create",
    detail: (projectId: string) => `/company/projects/${projectId}`,
    edit: (projectId: string) => `/company/projects/${projectId}/edit`,
  },
};


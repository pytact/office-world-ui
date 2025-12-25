// Task Route Helpers
// F-008: Task Management & Assignment
// Route helper functions following R11 rules

/**
 * Task management route helpers
 * Provides type-safe route generation
 * Following R11: 4-page structure (list, create, detail, edit)
 */
export const taskRoutes = {
  // Company routes
  company: {
    list: "/company/tasks",
    create: "/company/tasks/create",
    detail: (taskId: string) => `/company/tasks/${taskId}`,
    edit: (taskId: string) => `/company/tasks/${taskId}/edit`,
  },
};


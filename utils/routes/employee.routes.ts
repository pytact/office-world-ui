// Employee Route Helpers
// F-005: Employee Management
// Route helper functions following R11 rules

/**
 * Employee management route helpers
 * Provides type-safe route generation
 */
export const employeeRoutes = {
  // Company routes (CEO, HR, Manager, Employee)
  company: {
    list: "/company/employees",
    create: "/company/employees/create",
    detail: (employeeId: string) => `/company/employees/${employeeId}`,
    edit: (employeeId: string) => `/company/employees/${employeeId}/edit`,
  },

  // Self profile route (Employee only)
  self: {
    profile: "/me/profile",
  },
};


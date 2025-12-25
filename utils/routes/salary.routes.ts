// Salary Route Helpers
// F-006: Salary & History Management
// Route helper functions following R11 rules

/**
 * Salary management route helpers
 * Provides type-safe route generation
 */
export const salaryRoutes = {
  // Company routes (CEO, HR only)
  company: {
    overview: (employeeId: string) => `/company/employees/${employeeId}/salary`,
    create: (employeeId: string) => `/company/employees/${employeeId}/salary/create`,
    revise: (employeeId: string) => `/company/employees/${employeeId}/salary/revise`,
    paymentCreate: (employeeId: string) => `/company/employees/${employeeId}/salary/payments/create`,
  },
};


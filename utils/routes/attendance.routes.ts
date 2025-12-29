// Attendance Route Helpers
// F-010: Attendance Management
// Route helper functions following R11 rules

/**
 * Attendance management route helpers
 * Provides type-safe route generation
 * Following R11: Route structure for attendance feature
 * Note: Create/Edit routes not included as attendance is immutable (per F-010 API spec)
 */
export const attendanceRoutes = {
  // Employee routes (own attendance)
  employee: {
    today: "/attendance/today",
    history: "/attendance",
  },

  // Company routes (Manager, HR, CEO only)
  company: {
    list: "/company/attendance",
    detail: (employeeId: string, date: string) =>
      `/company/attendance/${employeeId}/${date}`,
  },
};


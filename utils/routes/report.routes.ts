// Report Route Helpers
// F-012: Reports & Analytics
// Route helper functions following R11 rules

import { ReportType } from "@/utils/types/requests/report";

/**
 * Report management route helpers
 * Provides type-safe route generation
 * Following R11: Reports are read-only, so no create/edit routes
 * 
 * Note: Reports feature is read-only - no create/edit operations
 * - List: Shows available report types
 * - Detail: Shows specific report view with filters
 */
export const reportRoutes = {
  // Company routes (CEO, HR, Manager, Employee)
  company: {
    list: "/company/reports",
    detail: (reportType: ReportType) => `/company/reports/${reportType}`,
  },
};


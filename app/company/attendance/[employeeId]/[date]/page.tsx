// Company Attendance Detail Page
// Route: /company/attendance/:employeeId/:date
// SCR_ATTENDANCE_DETAIL
// Manager, HR, CEO only - Employee and SuperAdmin excluded
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const AttendanceDetailContainer = dynamic(
  () =>
    import("@/modules/attendance/components/AttendanceDetailContainer").then(
      (mod) => ({ default: mod.AttendanceDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading attendance details..." />,
    ssr: false,
  }
);

export default function CompanyAttendanceDetailPage() {
  return (
    <RouteGuard allowedRoles={["manager", "hr", "ceo"]}>
      <AttendanceDetailContainer />
    </RouteGuard>
  );
}


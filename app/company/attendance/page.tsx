// Company Attendance List Page
// Route: /company/attendance
// SCR_ATTENDANCE_LOGS (Company List)
// Manager, HR, CEO only - Employee and SuperAdmin excluded
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const AttendanceListContainer = dynamic(
  () =>
    import("@/modules/attendance/components/AttendanceListContainer").then(
      (mod) => ({ default: mod.AttendanceListContainer })
    ),
  {
    loading: () => <Loader message="Loading company attendance..." />,
    ssr: false,
  }
);

export default function CompanyAttendanceListPage() {
  return (
    <RouteGuard allowedRoles={["manager", "hr", "ceo"]}>
      <AttendanceListContainer />
    </RouteGuard>
  );
}


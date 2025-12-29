// Attendance History Page
// Route: /attendance
// SCR_ATTENDANCE_LOGS (Employee History)
// Employee, Manager, HR, CEO (own attendance only) - SuperAdmin excluded
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
    loading: () => <Loader message="Loading attendance history..." />,
    ssr: false,
  }
);

export default function AttendanceHistoryPage() {
  return (
    <RouteGuard allowedRoles={["employee", "manager", "hr", "ceo"]}>
      <AttendanceListContainer />
    </RouteGuard>
  );
}


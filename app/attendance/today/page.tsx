// Attendance Today Page
// Route: /attendance/today
// SCR_ATTENDANCE_TODAY
// Employee, Manager, HR, CEO (own attendance only) - SuperAdmin excluded
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const AttendanceTodayContainer = dynamic(
  () =>
    import("@/modules/attendance/components/AttendanceTodayContainer").then(
      (mod) => ({ default: mod.AttendanceTodayContainer })
    ),
  {
    loading: () => <Loader message="Loading attendance..." />,
    ssr: false,
  }
);

export default function AttendanceTodayPage() {
  return (
    <RouteGuard allowedRoles={["employee", "manager", "hr", "ceo"]}>
      <AttendanceTodayContainer />
    </RouteGuard>
  );
}


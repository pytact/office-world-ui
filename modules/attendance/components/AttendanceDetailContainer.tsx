// Attendance Detail Container
// SCR_ATTENDANCE_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { AttendanceDetail } from "./AttendanceDetail";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useAttendanceDetail } from "@/hooks/useAttendance";
import { useAttendanceContext } from "@/context/AttendanceContext";
import { attendanceRoutes } from "@/utils/routes";
import {
  transformAttendanceResponse,
  useAttendanceLogTransformations,
} from "@/hooks/useAttendanceTransformations";

export function AttendanceDetailContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const employeeId = params?.employeeId as string;
  const date = params?.date as string;
  const { canViewCompanyDetail } = useAttendanceContext();

  const attendanceQuery = useAttendanceDetail(employeeId, date);

  // Get attendance data
  const attendanceData = attendanceQuery.data?.data?.attendance || null;
  const employeeData = attendanceQuery.data?.data?.employee || null;
  const logsData = attendanceQuery.data?.data?.logs || [];

  // Transform attendance data
  const transformedAttendance = useMemo(() => {
    if (!attendanceData) return null;
    return transformAttendanceResponse(
      attendanceData,
      undefined // Can be enhanced with employee timezone
    );
  }, [attendanceData]);

  // Transform logs
  const transformedLogs = useAttendanceLogTransformations(logsData, undefined);

  // Get employee name
  const employeeName = useMemo(() => {
    if (!employeeData) return "Unknown Employee";
    return `${employeeData.first_name} ${employeeData.last_name}`;
  }, [employeeData]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    router.push(attendanceRoutes.company.list);
  }, [router]);

  // Loading state (AFTER all hooks)
  if (attendanceQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (attendanceQuery.isError) {
    return (
      <ErrorState
        message={
          attendanceQuery.error?.message || "Failed to load attendance details"
        }
        onRetry={() => attendanceQuery.refetch()}
      />
    );
  }

  // 404 or no data
  if (!attendanceData || !transformedAttendance) {
    return (
      <ErrorState
        message="Attendance record not found"
        onRetry={() => router.push(attendanceRoutes.company.list)}
      />
    );
  }

  // Permission check
  if (!canViewCompanyDetail) {
    return (
      <AccessDenied
        message="You don't have access to view attendance details"
        redirectTo={attendanceRoutes.company.list}
      />
    );
  }

  return (
    <AttendanceDetail
      attendance={transformedAttendance}
      employeeName={employeeName}
      logs={transformedLogs}
      onBack={handleBack}
    />
  );
}


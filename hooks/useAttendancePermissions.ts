// Attendance Permissions Hook
// Encapsulates permission checks for attendance operations
// Following R5 rules: Business logic in hooks

import { useMemo } from "react";
import { AttendanceResponse, AttendanceTodayData } from "@/utils/types/responses/attendance";
import { AttendanceStatus } from "@/utils/types/requests/attendance";

interface UseAttendancePermissionsParams {
  attendance?: AttendanceResponse | null;
  attendanceToday?: AttendanceTodayData | null;
}

interface UseAttendancePermissionsReturn {
  canCheckIn: boolean;
  canCheckOut: boolean;
  isReadOnly: boolean;
}

/**
 * Hook for checking attendance-related permissions based on attendance status
 * Encapsulates permission logic following F-010 feature spec
 * 
 * Business Rules:
 * - can_check_in: true if status === "NOT_STARTED"
 * - can_check_out: true if status === "CHECKED_IN" AND check_in_time exists
 * - isReadOnly: true if status === "CHECKED_OUT" (immutable after check-out)
 * 
 * @param params - Attendance data (either full response or today's data)
 * @returns Permission flags for attendance operations
 */
export function useAttendancePermissions(
  params?: UseAttendancePermissionsParams
): UseAttendancePermissionsReturn {
  const { attendance, attendanceToday } = params || {};

  // Extract attendance from today's data if provided
  const attendanceData = attendance || attendanceToday?.attendance;

  const permissions = useMemo(() => {
    if (!attendanceData) {
      // Default permissions when data is missing (assume NOT_STARTED)
      return {
        canCheckIn: true,
        canCheckOut: false,
        isReadOnly: false,
      };
    }

    const { status, check_in_time } = attendanceData;

    // Determine permissions based on status
    const canCheckIn = status === "NOT_STARTED";
    const canCheckOut =
      status === "CHECKED_IN" && check_in_time !== null;
    const isReadOnly = status === "CHECKED_OUT";

    return {
      canCheckIn,
      canCheckOut,
      isReadOnly,
    };
  }, [attendanceData]);

  return permissions;
}


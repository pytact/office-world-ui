// Live Worked Time Hook
// Calculates live working time counter from server time and check-in time
// Following R5 rules: Business logic in hooks

import { useState, useEffect, useMemo } from "react";
import { AttendanceResponse, AttendanceTodayData } from "@/utils/types/responses/attendance";

interface UseLiveWorkedTimeParams {
  attendance?: AttendanceResponse | null;
  attendanceToday?: AttendanceTodayData | null;
  enabled?: boolean; // Whether to enable live counter updates
}

interface UseLiveWorkedTimeReturn {
  liveWorkedTime: string | null; // Formatted duration with seconds (e.g., "9h 29m 30s")
  liveWorkedTimeSeconds: number | null; // Duration in seconds
  isRunning: boolean; // Whether counter is currently running
}

/**
 * Formats duration in seconds to human-readable string
 * Example: 34140 seconds -> "9h 29m" (for final time)
 * Example: 34140 seconds -> "9h 29m 0s" (for live counter with seconds)
 * @param seconds - Duration in seconds
 * @param showSeconds - Whether to include seconds in the format (for live counters)
 */
function formatDuration(seconds: number, showSeconds: boolean = false): string {
  if (seconds < 0) return showSeconds ? "0h 0m 0s" : "0h 0m";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (showSeconds) {
    // Live counter format with seconds
    if (hours === 0 && minutes === 0) {
      return `${secs}s`;
    }
    if (hours === 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${hours}h ${minutes}m ${secs}s`;
  }

  // Final time format without seconds
  if (hours === 0 && minutes === 0) {
    return "0h 0m";
  }

  if (hours === 0) {
    return `${minutes}m`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}

/**
 * Hook for calculating live worked time counter
 * Calculates duration between check_in_time and current time (or server_time)
 * Updates every second when attendance status is CHECKED_IN
 * 
 * Business Rules:
 * - Only calculates when status === "CHECKED_IN"
 * - Uses server_time from API for initial calculation
 * - Updates using client time for live counter
 * - Returns null if not checked in or already checked out
 * 
 * @param params - Attendance data and enable flag
 * @returns Live worked time string, seconds, and running state
 */
export function useLiveWorkedTime(
  params?: UseLiveWorkedTimeParams
): UseLiveWorkedTimeReturn {
  const { attendance, attendanceToday, enabled = true } = params || {};

  // Extract attendance and context from today's data if provided
  const attendanceData = attendance || attendanceToday?.attendance;
  const serverTime = attendanceToday?.context?.server_time;
  const employeeTimezone = attendanceToday?.context?.employee_timezone;

  // Calculate initial duration from server time
  const initialDuration = useMemo(() => {
    if (
      !attendanceData ||
      attendanceData.status !== "CHECKED_IN" ||
      !attendanceData.check_in_time ||
      !serverTime
    ) {
      return null;
    }

    try {
      const checkInTime = new Date(attendanceData.check_in_time).getTime();
      const serverTimeMs = new Date(serverTime).getTime();
      const diffSeconds = Math.floor((serverTimeMs - checkInTime) / 1000);
      return diffSeconds;
    } catch {
      return null;
    }
  }, [attendanceData, serverTime]);

  // State for live counter
  const [currentDuration, setCurrentDuration] = useState<number | null>(
    initialDuration
  );

  // Update duration when initial calculation changes
  useEffect(() => {
    if (initialDuration !== null) {
      setCurrentDuration(initialDuration);
    }
  }, [initialDuration]);

  // Live counter update effect
  useEffect(() => {
    if (
      !enabled ||
      !attendanceData ||
      attendanceData.status !== "CHECKED_IN" ||
      !attendanceData.check_in_time ||
      initialDuration === null
    ) {
      setCurrentDuration(null);
      return;
    }

    // Calculate base time from check-in
    const checkInTime = new Date(attendanceData.check_in_time).getTime();
    const serverTimeMs = serverTime
      ? new Date(serverTime).getTime()
      : Date.now();
    const baseOffset = serverTimeMs - checkInTime;

    // Update counter every second
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - checkInTime) / 1000);
      setCurrentDuration(elapsed);
    }, 1000);

    // Initial calculation
    const elapsed = Math.floor((Date.now() - checkInTime) / 1000);
    setCurrentDuration(elapsed);

    return () => clearInterval(interval);
  }, [
    enabled,
    attendanceData,
    attendanceData?.status,
    attendanceData?.check_in_time,
    initialDuration,
    serverTime,
  ]);

  // Determine if counter is running
  const isRunning = useMemo(() => {
    return (
      enabled &&
      attendanceData?.status === "CHECKED_IN" &&
      attendanceData?.check_in_time !== null &&
      currentDuration !== null
    );
  }, [enabled, attendanceData?.status, attendanceData?.check_in_time, currentDuration]);

  // Format duration string with seconds for live counter
  const liveWorkedTime = useMemo(() => {
    if (currentDuration === null) return null;
    // Always show seconds for live counter
    return formatDuration(currentDuration, true);
  }, [currentDuration]);

  return {
    liveWorkedTime,
    liveWorkedTimeSeconds: currentDuration,
    isRunning,
  };
}


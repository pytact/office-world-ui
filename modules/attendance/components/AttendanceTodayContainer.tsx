// Attendance Today Container
// SCR_ATTENDANCE_TODAY - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useMemo, useState } from "react";
import { AttendanceToday } from "./AttendanceToday";
import { CheckoutConfirmationModal } from "./CheckoutConfirmationModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import {
  useAttendanceToday,
  useCheckIn,
  useCheckOut,
} from "@/hooks/useAttendance";
import { useAttendanceContext } from "@/context/AttendanceContext";
import { useAttendancePermissions } from "@/hooks/useAttendancePermissions";
import { useLiveWorkedTime } from "@/hooks/useLiveWorkedTime";
import { transformAttendanceResponse } from "@/hooks/useAttendanceTransformations";
import { useToast } from "@/context/ToastContext";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

export function AttendanceTodayContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const { canCheckInOut } = useAttendanceContext();
  const { showSuccess, showError } = useToast();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const attendanceQuery = useAttendanceToday();
  const checkInMutation = useCheckIn();
  const checkOutMutation = useCheckOut();

  // Memoize today's date format to prevent re-creation on every render (R15 Issue 3)
  const todayDateFormatted = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    []
  );

  // Get attendance data
  const attendanceData = attendanceQuery.data?.data?.attendance || null;
  const context = attendanceQuery.data?.data?.context;

  // Get permissions based on attendance status
  const permissions = useAttendancePermissions({
    attendanceToday: attendanceQuery.data?.data || null,
  });

  // Get live worked time
  const liveTime = useLiveWorkedTime({
    attendanceToday: attendanceQuery.data?.data || null,
    enabled: permissions.canCheckOut && !permissions.isReadOnly,
  });

  // Transform attendance data
  const transformedAttendance = useMemo(() => {
    if (!attendanceData) return null;
    return transformAttendanceResponse(
      attendanceData,
      context?.employee_timezone
    );
  }, [attendanceData, context?.employee_timezone]);

  // Handle check-in
  const handleCheckIn = useCallback(async () => {
    try {
      await checkInMutation.mutateAsync(undefined);
      showSuccess("Checked in successfully");
      attendanceQuery.refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(
        normalizedError?.message || "Failed to check in. Please try again."
      );
    }
  }, [checkInMutation, showSuccess, showError, attendanceQuery]);

  // Handle check-out (opens confirmation modal)
  const handleCheckOutClick = useCallback(() => {
    setShowCheckoutModal(true);
  }, []);

  // Handle check-out confirmation
  const handleCheckOutConfirm = useCallback(async () => {
    try {
      await checkOutMutation.mutateAsync(undefined);
      showSuccess("Checked out successfully");
      setShowCheckoutModal(false);
      attendanceQuery.refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(
        normalizedError?.message || "Failed to check out. Please try again."
      );
    }
  }, [checkOutMutation, showSuccess, showError, attendanceQuery]);

  // Loading state (AFTER all hooks)
  if (attendanceQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (attendanceQuery.isError) {
    // 404 is expected if no attendance record exists for today
    const error = attendanceQuery.error as NormalizedError | Error;
    const statusCode = 'statusCode' in error ? error.statusCode : undefined;
    if (statusCode === 404) {
      // Show UI with NOT_STARTED state
      return (
        <AttendanceToday
          attendance={null}
          liveWorkedTime={null}
          liveWorkedTimeSeconds={null}
          isRunning={false}
          canCheckIn={permissions.canCheckIn && canCheckInOut}
          canCheckOut={false}
          isReadOnly={!canCheckInOut}
          onCheckIn={handleCheckIn}
          onCheckOut={handleCheckOutClick}
          isCheckingIn={checkInMutation.isPending}
          isCheckingOut={checkOutMutation.isPending}
          attendanceDateFormatted={todayDateFormatted}
          checkInTimeFormatted={null}
          checkOutTimeFormatted={null}
          workedTimeFormatted="N/A"
        />
      );
    }

    return (
      <ErrorState
        message={
          attendanceQuery.error?.message || "Failed to load attendance data"
        }
        onRetry={() => attendanceQuery.refetch()}
      />
    );
  }

  // No data (should not happen, but handle gracefully)
  if (!attendanceData && !attendanceQuery.isLoading) {
    return (
      <AttendanceToday
        attendance={null}
        liveWorkedTime={null}
        liveWorkedTimeSeconds={null}
        isRunning={false}
        canCheckIn={permissions.canCheckIn && canCheckInOut}
        canCheckOut={false}
        isReadOnly={!canCheckInOut}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOutClick}
        isCheckingIn={checkInMutation.isPending}
        isCheckingOut={checkOutMutation.isPending}
        attendanceDateFormatted={todayDateFormatted}
        checkInTimeFormatted={null}
        checkOutTimeFormatted={null}
        workedTimeFormatted="N/A"
      />
    );
  }

  return (
    <>
      <AttendanceToday
        attendance={attendanceData}
        liveWorkedTime={liveTime.liveWorkedTime}
        liveWorkedTimeSeconds={liveTime.liveWorkedTimeSeconds}
        isRunning={liveTime.isRunning}
        canCheckIn={permissions.canCheckIn && canCheckInOut}
        canCheckOut={permissions.canCheckOut && canCheckInOut}
        isReadOnly={permissions.isReadOnly || !canCheckInOut}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOutClick}
        isCheckingIn={checkInMutation.isPending}
        isCheckingOut={checkOutMutation.isPending}
        attendanceDateFormatted={
          transformedAttendance?.attendanceDateFormatted || ""
        }
        checkInTimeFormatted={transformedAttendance?.checkInTimeFormatted || null}
        checkOutTimeFormatted={
          transformedAttendance?.checkOutTimeFormatted || null
        }
        workedTimeFormatted={transformedAttendance?.workedTimeFormatted || "N/A"}
      />

      {/* Checkout Confirmation Modal */}
      <CheckoutConfirmationModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckOutConfirm}
        workedTime={liveTime.liveWorkedTime || attendanceData?.worked_time || null}
        isLoading={checkOutMutation.isPending}
      />
    </>
  );
}


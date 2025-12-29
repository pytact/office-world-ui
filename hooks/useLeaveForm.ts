// Leave Form Hook
// Encapsulates form state and business logic for leave create
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { LeaveCreate, LeaveType, DayType } from "@/utils/types/requests/leave";

interface UseLeaveFormParams {
  initialLeaveType?: LeaveType;
  initialStartDate?: string;
  initialEndDate?: string;
  initialDayType?: DayType;
  initialReason?: string;
  initialManagerApproverId?: string;
  initialHRApproverId?: string;
}

interface UseLeaveFormReturn {
  // Form state
  leaveType: LeaveType | null;
  startDate: string;
  endDate: string;
  dayType: DayType | null;
  reason: string;
  managerApproverId: string;
  hrApproverId: string;
  setLeaveType: (leaveType: LeaveType | null) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
  setDayType: (dayType: DayType | null) => void;
  setReason: (reason: string) => void;
  setManagerApproverId: (managerApproverId: string) => void;
  setHRApproverId: (hrApproverId: string) => void;

  // Computed values
  isValid: boolean;
  reasonLength: number;
  calculatedNumberOfDays: number;
  hasSelectedApprovers: boolean;
  dateRangeValid: boolean;

  // Handlers
  resetForm: () => void;
  getCreatePayload: () => LeaveCreate | null;
}

/**
 * Calculates number of days from date range and day type
 * Note: This is a client-side approximation. Server validates working days.
 */
function calculateNumberOfDays(
  startDate: string,
  endDate: string,
  dayType: DayType | null
): number {
  if (!startDate || !endDate || !dayType) return 0;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    if (start > end) return 0;

    // Calculate difference in days (inclusive)
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // Apply day type multiplier
    if (dayType === "FULL_DAY") {
      return diffDays;
    } else if (dayType === "FIRST_HALF" || dayType === "SECOND_HALF") {
      return diffDays * 0.5;
    }

    return diffDays;
  } catch {
    return 0;
  }
}

/**
 * Validates date range
 */
function isDateRangeValid(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) return false;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return false;
    
    return start <= end;
  } catch {
    return false;
  }
}

/**
 * Hook for managing leave form state and business logic
 * Handles form validation and payload generation
 * @param params - Initial form values
 * @returns Form state, computed values, and handlers
 */
export function useLeaveForm(
  params?: UseLeaveFormParams
): UseLeaveFormReturn {
  const [leaveType, setLeaveType] = useState<LeaveType | null>(
    params?.initialLeaveType ?? null
  );
  const [startDate, setStartDate] = useState(
    params?.initialStartDate || ""
  );
  const [endDate, setEndDate] = useState(
    params?.initialEndDate || ""
  );
  const [dayType, setDayType] = useState<DayType | null>(
    params?.initialDayType ?? null
  );
  const [reason, setReason] = useState(
    params?.initialReason || ""
  );
  const [managerApproverId, setManagerApproverId] = useState(
    params?.initialManagerApproverId || ""
  );
  const [hrApproverId, setHRApproverId] = useState(
    params?.initialHRApproverId || ""
  );

  // Computed: Form validation
  const reasonLength = useMemo(() => reason.length, [reason]);
  const dateRangeValid = useMemo(() => {
    return isDateRangeValid(startDate, endDate);
  }, [startDate, endDate]);

  const calculatedNumberOfDays = useMemo(() => {
    return calculateNumberOfDays(startDate, endDate, dayType);
  }, [startDate, endDate, dayType]);

  const hasSelectedApprovers = useMemo(() => {
    return !!managerApproverId && !!hrApproverId;
  }, [managerApproverId, hrApproverId]);

  const isValid = useMemo(() => {
    return (
      leaveType !== null &&
      startDate.trim().length > 0 &&
      endDate.trim().length > 0 &&
      dayType !== null &&
      reason.trim().length >= 10 &&
      reason.trim().length <= 500 &&
      managerApproverId.trim().length > 0 &&
      hrApproverId.trim().length > 0 &&
      dateRangeValid
    );
  }, [
    leaveType,
    startDate,
    endDate,
    dayType,
    reason,
    managerApproverId,
    hrApproverId,
    dateRangeValid,
  ]);

  const resetForm = useCallback(() => {
    setLeaveType(null);
    setStartDate("");
    setEndDate("");
    setDayType(null);
    setReason("");
    setManagerApproverId("");
    setHRApproverId("");
  }, []);

  const getCreatePayload = useCallback((): LeaveCreate | null => {
    if (!isValid) return null;

    return {
      leave_type: leaveType!,
      start_date: startDate.trim(),
      end_date: endDate.trim(),
      day_type: dayType!,
      reason: reason.trim(),
      manager_approver_id: managerApproverId.trim(),
      hr_approver_id: hrApproverId.trim(),
    };
  }, [
    isValid,
    leaveType,
    startDate,
    endDate,
    dayType,
    reason,
    managerApproverId,
    hrApproverId,
  ]);

  return {
    leaveType,
    startDate,
    endDate,
    dayType,
    reason,
    managerApproverId,
    hrApproverId,
    setLeaveType,
    setStartDate,
    setEndDate,
    setDayType,
    setReason,
    setManagerApproverId,
    setHRApproverId,
    isValid,
    reasonLength,
    calculatedNumberOfDays,
    hasSelectedApprovers,
    dateRangeValid,
    resetForm,
    getCreatePayload,
  };
}


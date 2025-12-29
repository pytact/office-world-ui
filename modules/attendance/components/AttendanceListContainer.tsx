// Attendance List Container
// SCR_ATTENDANCE_LOGS - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AttendanceList } from "./AttendanceList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  useAttendanceHistory,
  useCompanyAttendanceList,
} from "@/hooks/useAttendance";
import { useAttendanceContext } from "@/context/AttendanceContext";
import { useAttendanceFilters } from "@/hooks/useAttendanceFilters";
import { useAttendancePagination } from "@/hooks/useAttendancePagination";
import {
  useAttendanceTransformations,
  useCompanyAttendanceTransformations,
} from "@/hooks/useAttendanceTransformations";
import { spacing } from "@/theme/tokens";
import { attendanceRoutes } from "@/utils/routes";
import type {
  AttendanceSummary,
  CompanyAttendanceSummary,
} from "@/utils/types/responses/attendance";

export function AttendanceListContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const { canViewCompanyAttendance, employeeId } = useAttendanceContext();

  // Determine if this is company attendance or employee history
  const isCompanyAttendance = canViewCompanyAttendance;

  // Initialize filters
  const filters = useAttendanceFilters();

  // Initialize pagination
  const paginationControls = useAttendancePagination();

  // Build query params - use debouncedEmployeeId from filters (R14)
  // Extract filter methods to avoid dependency on entire filters object
  const { getCompanyParams, getHistoryParams } = filters;
  const queryParams = useMemo(() => {
    const baseParams = {
      page: paginationControls.page,
      page_size: paginationControls.pageSize,
      ...(isCompanyAttendance
        ? getCompanyParams() // This already uses debouncedEmployeeId internally
        : getHistoryParams()),
    };
    return baseParams;
  }, [
    paginationControls.page,
    paginationControls.pageSize,
    getCompanyParams,
    getHistoryParams,
    isCompanyAttendance,
    filters.debouncedEmployeeId, // Explicitly depend on debouncedEmployeeId to trigger updates (R14)
  ]);

  // Use appropriate query hook
  const historyQuery = useAttendanceHistory(
    isCompanyAttendance ? undefined : queryParams
  );
  const companyQuery = useCompanyAttendanceList(
    isCompanyAttendance ? queryParams : undefined
  );

  const attendanceQuery = isCompanyAttendance ? companyQuery : historyQuery;

  // Get timezone from context (if available) or use default
  const timezone = undefined; // Can be enhanced with user timezone from context

  // Transform attendance data
  const rawAttendances = attendanceQuery.data?.data?.items || [];
  
  // Type-safe transformation based on attendance type
  const historyAttendances = isCompanyAttendance 
    ? [] 
    : (rawAttendances as AttendanceSummary[]);
  const companyAttendances = isCompanyAttendance 
    ? (rawAttendances as CompanyAttendanceSummary[])
    : [];
  
  const transformedHistoryAttendances = useAttendanceTransformations(
    historyAttendances,
    timezone
  );
  const transformedCompanyAttendances = useCompanyAttendanceTransformations(
    companyAttendances,
    timezone
  );

  const transformedAttendances = useMemo(() => {
    return isCompanyAttendance
      ? transformedCompanyAttendances
      : transformedHistoryAttendances;
  }, [isCompanyAttendance, transformedCompanyAttendances, transformedHistoryAttendances]);

  // Update pagination from response
  // Extract updateFromResponse to avoid dependency on entire paginationControls object
  const { updateFromResponse } = paginationControls;
  
  // Use ref to track last updated pagination data to prevent infinite loops
  const lastPaginationDataRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (!attendanceQuery.data?.data) return;
    
    const responseData = attendanceQuery.data.data;
    
    // Create a unique key from pagination data to detect actual changes
    const paginationKey = JSON.stringify({
      total: responseData.total,
      page: responseData.page,
      page_size: responseData.page_size,
      total_pages: responseData.total_pages,
    });
    
    // Only update if pagination data actually changed
    if (lastPaginationDataRef.current === paginationKey) {
      return; // No change, skip update
    }
    
    lastPaginationDataRef.current = paginationKey;
    
    updateFromResponse({
      total: responseData.total,
      page: responseData.page,
      page_size: responseData.page_size,
      total_pages: responseData.total_pages,
      next_page: responseData.next_page,
      prev_page: responseData.prev_page,
    });
  }, [attendanceQuery.data?.data, updateFromResponse]);

  // Empty state container style (memoized) - MUST be before early returns
  const emptyStateContainerStyle = React.useMemo(
    () => ({
      padding: `${spacing[12]} ${spacing[6]}`,
      maxWidth: "800px",
      margin: "0 auto",
    } as const),
    []
  );

  // Memoized handlers (R14: Performance) - MUST be before early returns (R15 Issue 12)
  const handleAttendanceClick = useCallback(
    (attendanceId: string) => {
      // Only navigate for company attendance (employee history doesn't have detail page)
      if (!isCompanyAttendance) {
        return;
      }
      
      // Find the attendance to get employee_id and date
      const attendance = attendanceQuery.data?.data?.items.find(
        (a) => a.id === attendanceId
      );
      
      if (attendance && "employee" in attendance) {
        // Type guard ensures it's CompanyAttendanceSummary
        const companyAttendance = attendance as CompanyAttendanceSummary;
        const employeeId = companyAttendance.employee.id;
        const date = companyAttendance.attendance_date;
        
        router.push(
          attendanceRoutes.company.detail(employeeId, date)
        );
      }
    },
    [router, attendanceQuery.data?.data?.items, isCompanyAttendance]
  );

  // Build pagination object - MUST be before early returns (R15 Issue 12)
  const pagination = useMemo(() => {
    if (!attendanceQuery.data?.data) {
      return {
        total: 0,
        page: 1,
        pageSize: 20,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
        nextPage: null,
        prevPage: null,
      };
    }

    return {
      total: attendanceQuery.data.data.total,
      page: attendanceQuery.data.data.page,
      pageSize: attendanceQuery.data.data.page_size,
      totalPages: attendanceQuery.data.data.total_pages,
      hasNextPage: !!attendanceQuery.data.data.next_page,
      hasPreviousPage: !!attendanceQuery.data.data.prev_page,
      nextPage: attendanceQuery.data.data.next_page,
      prevPage: attendanceQuery.data.data.prev_page,
    };
  }, [attendanceQuery.data?.data]);

  // Loading state (AFTER all hooks)
  if (attendanceQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (attendanceQuery.isError) {
    return (
      <ErrorState
        message={
          attendanceQuery.error?.message || "Failed to load attendance records"
        }
        onRetry={() => attendanceQuery.refetch()}
      />
    );
  }

  // Empty state
  if (!transformedAttendances || transformedAttendances.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <EmptyState
          message={
            filters.hasActiveFilters
              ? "No attendance records match your filters"
              : "No attendance records found"
          }
          description={
            filters.hasActiveFilters
              ? "Try adjusting your search or filter criteria to see more results."
              : "No attendance records are available at this time."
          }
          actionText={filters.hasActiveFilters ? "Clear Filters" : undefined}
          onActionClick={
            filters.hasActiveFilters ? filters.resetFilters : undefined
          }
        />
      </div>
    );
  }

  return (
    <AttendanceList
      attendances={transformedAttendances}
      filters={filters}
      pagination={paginationControls}
      showEmployee={isCompanyAttendance}
      onAttendanceClick={handleAttendanceClick}
    />
  );
}


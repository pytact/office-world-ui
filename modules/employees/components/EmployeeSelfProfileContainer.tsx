// Employee Self Profile Container
// SCR_EMPLOYEE_SELF_PROFILE - Container component following R7
// Handles business logic for employee viewing own profile

"use client";

import React, { useMemo } from "react";
import { useAuthContext } from "@/context";
import { useListEmployees } from "@/hooks/useEmployees";
import {
  transformEmployeeDetail,
  type TransformedEmployeeDetail,
} from "@/hooks/useEmployeeTransformations";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { EmployeeSelfProfile } from "./EmployeeSelfProfile";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";

export function EmployeeSelfProfileContainer() {
  const { user } = useAuthContext();
  const { canViewOwnProfile } = useEmployeePermissions();

  // Permission check
  if (!canViewOwnProfile) {
    return <AccessDenied message="You do not have permission to view your profile." />;
  }

  if (!user?.user_id) {
    return <ErrorState message="User information not available" />;
  }

  // Fetch employee list and find the one matching current user's user_id
  // Note: This is a workaround since there's no direct endpoint to get employee by user_id
  // In production, this should be optimized with a dedicated endpoint
  const { data, isLoading, isError, error, refetch } = useListEmployees({
    page_size: 1000, // Get all employees to find the matching one
  });

  // Find employee matching current user's user_id
  const employee = useMemo(() => {
    if (!data?.data?.items || !user?.user_id) return null;

    const matchingEmployee = data.data.items.find(
      (emp) => emp.user_id === user.user_id
    );

    if (!matchingEmployee) return null;

    // Transform the employee detail
    // Note: We have EmployeeSummary, but we need EmployeeDetail
    // For now, we'll need to fetch the full detail using the employee_id
    // This is not ideal but works until a proper endpoint is available
    return matchingEmployee;
  }, [data?.data?.items, user?.user_id]);

  // Loading state
  if (isLoading) {
    return <Loader message="Loading your profile..." />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load profile"}
        onRetry={refetch}
      />
    );
  }

  // No employee found
  if (!employee) {
    return (
      <ErrorState
        message="Employee profile not found. Please contact your administrator."
        onRetry={refetch}
      />
    );
  }

  // Note: We have EmployeeSummary but need EmployeeDetail for full profile
  // For now, we'll show a simplified view with available data
  // TODO: Fetch full employee detail using employee.employee_id
  // This requires calling useGetEmployee(employee.employee_id) which might have permission issues
  // For Employee role, the API returns 403 for GET /api/v1/company/employees/{employee_id}
  
  // Workaround: Show a message that full profile view needs proper endpoint
  return (
    <ErrorState
      message="Full profile view requires a dedicated endpoint. Please contact your administrator."
    />
  );
}


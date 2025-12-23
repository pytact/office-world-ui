// Employee Create Container
// SCR_EMPLOYEE_CREATE - Container component following R7 and R10
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo, useCallback } from "react";
import { useEmployeeCreateForm } from "@/modules/employees/forms/useEmployeeCreateForm";
import { useEmployeeCreateFormSubmit } from "@/modules/employees/forms/useEmployeeCreateFormSubmit";
import { useListCompanyUsers } from "@/hooks/useUsers";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { useListEmployees } from "@/hooks/useEmployees";
import { EmployeeCreateForm } from "./EmployeeCreateForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useRouter } from "next/navigation";
import { employeeRoutes } from "@/utils/routes/employee.routes";

export function EmployeeCreateContainer() {
  const router = useRouter();
  const { canCreateEmployee } = useEmployeePermissions();

  // Permission check
  if (!canCreateEmployee) {
    return <AccessDenied message="You do not have permission to create employees." />;
  }

  // Fetch company users for selection
  const { 
    data: usersData, 
    isLoading: isLoadingUsers, 
    error: usersError,
    refetch: refetchUsers,
  } = useListCompanyUsers({
    page_size: 100, // Get more users for selection
    status: "activated", // Only show activated users
  });

  // Fetch existing employees to filter out users who already have employee records
  const { 
    data: employeesData, 
    isLoading: isLoadingEmployees,
    refetch: refetchEmployees,
  } = useListEmployees({
    page_size: 1000, // Get all employees to check
  });

  // Initialize form
  const form = useEmployeeCreateForm();
  const { submit, isLoading: isSubmitting } = useEmployeeCreateFormSubmit({ form });

  // Filter users: exclude those who already have employee records
  const availableUsers = useMemo(() => {
    if (!usersData?.data?.items) return [];

    const employeeUserIds = new Set(
      employeesData?.data?.items?.map((emp) => emp.user_id) || []
    );

    return usersData.data.items
      .filter((user) => !employeeUserIds.has(user.user_id))
      .map((user) => ({
        value: user.user_id,
        label: `${user.first_name} ${user.last_name} (${user.email})`,
      }));
  }, [usersData?.data?.items, employeesData?.data?.items]);

  const handleCancel = useCallback(() => {
    router.push(employeeRoutes.company.list);
  }, [router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await form.handleSubmit(submit)(e);
    },
    [form, submit]
  );

  // Loading state
  if (isLoadingUsers || isLoadingEmployees) {
    return <Loader message="Loading form data..." />;
  }

  // Memoized retry handler
  const handleRetry = useCallback(async () => {
    await Promise.all([refetchUsers(), refetchEmployees()]);
  }, [refetchUsers, refetchEmployees]);

  // Error state
  if (usersError) {
    return (
      <ErrorState
        message={`Failed to load users: ${usersError.message}`}
        onRetry={handleRetry}
      />
    );
  }

  // No available users
  if (availableUsers.length === 0) {
    return (
      <ErrorState
        message="No available users found. All users in your company already have employee records."
        onRetry={handleRetry}
      />
    );
  }

  return (
    <EmployeeCreateForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isSubmitting}
      userOptions={availableUsers}
    />
  );
}


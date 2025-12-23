// Employee List Container
// SCR_EMPLOYEE_LIST - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React from "react";
import { EmployeeList } from "./EmployeeList";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useEmployeeListData } from "@/hooks/useEmployeeListData";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { AccessDenied } from "@/components/ui/AccessDenied";

export function EmployeeListContainer() {
  const { canViewEmployeeList } = useEmployeePermissions();
  const {
    isLoading,
    isError,
    error,
    refetch,
    employees,
    pagination,
    filters,
    paginationControls,
  } = useEmployeeListData();

  // Permission check
  if (!canViewEmployeeList) {
    return <AccessDenied message="You do not have permission to view employees." />;
  }

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (isError) {
    return (
      <ErrorState
        message={error?.message || "Failed to load employees"}
        onRetry={refetch}
      />
    );
  }

  // Empty state
  if (!employees || employees.length === 0) {
    return <EmptyState message="No employees found" />;
  }

  // Success state
  return (
    <EmployeeList
      employees={employees}
      pagination={pagination}
      filters={filters}
      paginationControls={paginationControls}
    />
  );
}


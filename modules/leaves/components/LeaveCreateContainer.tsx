// Leave Create Container
// SCR_LEAVE_CREATE - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo } from "react";
import { LeaveCreateForm } from "./LeaveCreateForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useLeaveCreateForm, useLeaveCreateFormSubmit } from "@/modules/leaves/forms";
import { useLeaveContext } from "@/context/LeaveContext";
import { useListEmployees } from "@/hooks/useEmployees";
import { useLeaveForm } from "@/hooks/useLeaveForm";
import { leaveRoutes } from "@/utils/routes";

export function LeaveCreateContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const { canCreateLeave, userRole, employeeId } = useLeaveContext();

  // Fetch employees filtered by role: managers
  // Using role_code filter to get only managers
  // Note: Using default page_size: 20 (project standard)
  // If company has more than 20 managers, some may not appear in dropdown
  const managersQuery = useListEmployees({
    role_code: "manager",
    page_size: 20,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Fetch employees filtered by role: HR
  // Using role_code filter to get only HR personnel
  // Note: Using default page_size: 20 (project standard)
  // If company has more than 20 HR, some may not appear in dropdown
  const hrQuery = useListEmployees({
    role_code: "hr",
    page_size: 20,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Form hook (React Hook Form)
  // For HR: Auto-fill hr_approver_id with their own employee_id
  const form = useLeaveCreateForm({
    defaultValues: userRole === "hr" && employeeId
      ? {
          hr_approver_id: employeeId, // HR auto-selects themselves as HR approver
        }
      : undefined,
  });

  // Business logic hook for calculated days
  const leaveFormLogic = useLeaveForm();

  // Update leaveFormLogic when form values change
  const leaveType = form.watch("leave_type");
  const startDate = form.watch("start_date");
  const endDate = form.watch("end_date");
  const dayType = form.watch("day_type");

  React.useEffect(() => {
    if (leaveType) {
      leaveFormLogic.setLeaveType(leaveType);
    }
    if (startDate) {
      leaveFormLogic.setStartDate(startDate);
    }
    if (endDate) {
      leaveFormLogic.setEndDate(endDate);
    }
    if (dayType) {
      leaveFormLogic.setDayType(dayType);
    }
  }, [leaveType, startDate, endDate, dayType, leaveFormLogic]);

  // Form submit hook
  const { submit, isLoading } = useLeaveCreateFormSubmit(form);

  // Transform managers to options for dropdown - MUST be before early returns (R15 Issue 12)
  const managerOptions = useMemo(() => {
    if (!managersQuery.data?.data?.items) return [];

    // Map employees directly to dropdown options
    // Employee response already includes employee_id and user info
    return managersQuery.data.data.items
      .filter((emp) => {
        // Only include active employees (is_active flag, not employment_status)
        return emp.is_active === true;
      })
      .map((emp) => {
        // Build name from first_name and last_name, fallback to email, then employee_id
        let name = "";
        if (emp.user?.first_name || emp.user?.last_name) {
          name = [emp.user.first_name, emp.user.last_name]
            .filter(Boolean)
            .join(" ")
            .trim();
        }
        if (!name && emp.user?.email) {
          name = emp.user.email;
        }
        if (!name) {
          name = emp.employee_id;
        }
        return {
          value: emp.employee_id,
          label: name,
        };
      });
  }, [managersQuery.data?.data?.items]);

  // Transform HR employees to options for dropdown
  const hrOptions = useMemo(() => {
    if (!hrQuery.data?.data?.items) return [];

    // Map employees directly to dropdown options
    // Employee response already includes employee_id and user info
    return hrQuery.data.data.items
      .filter((emp) => {
        // Only include active employees (is_active flag, not employment_status)
        return emp.is_active === true;
      })
      .map((emp) => {
        // Build name from first_name and last_name, fallback to email, then employee_id
        let name = "";
        if (emp.user?.first_name || emp.user?.last_name) {
          name = [emp.user.first_name, emp.user.last_name]
            .filter(Boolean)
            .join(" ")
            .trim();
        }
        if (!name && emp.user?.email) {
          name = emp.user.email;
        }
        if (!name) {
          name = emp.employee_id;
        }
        return {
          value: emp.employee_id,
          label: name,
        };
      });
  }, [hrQuery.data?.data?.items]);

  // Permission check (AFTER all hooks)
  if (!canCreateLeave) {
    return (
      <AccessDenied
        message="You don't have permission to create leave requests"
        redirectTo={leaveRoutes.company.list}
      />
    );
  }

  // Loading state for employees (AFTER all hooks)
  if (managersQuery.isLoading || hrQuery.isLoading) {
    return <Loader />;
  }

  // Error state for employees (AFTER all hooks)
  if (managersQuery.isError || hrQuery.isError) {
    const errorMessage =
      managersQuery.error?.message ||
      hrQuery.error?.message ||
      "Failed to load approvers";
    return (
      <ErrorState
        message={errorMessage}
        onRetry={() => {
          managersQuery.refetch();
          hrQuery.refetch();
        }}
      />
    );
  }

  return (
    <LeaveCreateForm
      form={form}
      onSubmit={submit}
      isLoading={isLoading}
      managerOptions={managerOptions} // Pass managers even for HR (for auto-fill)
      hrOptions={hrOptions} // Pass HR options even for HR (for auto-fill)
      calculatedDays={leaveFormLogic.calculatedNumberOfDays}
      userRole={userRole}
      employeeId={employeeId} // Pass employeeId for HR to auto-fill hr_approver_id
    />
  );
}


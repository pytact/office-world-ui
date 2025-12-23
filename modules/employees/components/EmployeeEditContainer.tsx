// Employee Edit Container
// SCR_EMPLOYEE_EDIT - Container component following R7 and R10
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { useEmployeeUpdateForm } from "@/modules/employees/forms/useEmployeeUpdateForm";
import { useEmployeeUpdateFormSubmit } from "@/modules/employees/forms/useEmployeeUpdateFormSubmit";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { EmployeeEditForm } from "./EmployeeEditForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { employeeRoutes } from "@/utils/routes/employee.routes";

export function EmployeeEditContainer() {
  const params = useParams();
  const router = useRouter();
  const employeeId = params?.id as string;

  const { canUpdateEmployee } = useEmployeePermissions();
  const {
    isLoading,
    isError,
    error,
    refetch,
    employee,
  } = useEmployeeDetail(employeeId);

  // Extract ETag from updated_at field
  const etag = useMemo(() => {
    if (!employee) return null;
    return extractETagFromUpdatedAt(employee);
  }, [employee]);

  // Initialize form with employee data
  const form = useEmployeeUpdateForm({
    employee: employee || null,
  });

  // Populate form when employee data loads
  // Using employee_id as dependency to avoid unnecessary resets
  useEffect(() => {
    if (employee) {
      form.reset({
        employment_status: employee.employment_status || null,
        job_title: employee.job_title || null,
        department: employee.department || null,
        employment_type: employee.employment_type || null,
        employment_level: employee.employment_level || null,
        work_email: employee.work_email || null,
        gender: employee.gender || null,
        marital_status: employee.marital_status || null,
        blood_group: employee.blood_group || null,
        nationality: employee.nationality || null,
        address: employee.address || null,
        city: employee.city || null,
        state: employee.state || null,
        country: employee.country || null,
        document_type: employee.document_type || null,
        document_number: employee.document_number || null,
        separation_initiated_date: employee.separation_initiated_date || null,
        separation_reason: employee.separation_reason || null,
        last_working_day: employee.last_working_day || null,
        notice_period_days: employee.notice_period_days || null,
        is_active: employee.is_active ?? null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee?.employee_id]); // Only reset when employee_id changes

  const { submit, isLoading: isSubmitting } = useEmployeeUpdateFormSubmit({
    form,
    employee_id: employeeId,
    etag,
    onSuccess: () => {
      router.push(employeeRoutes.company.detail(employeeId));
    },
  });

  const handleCancel = useCallback(() => {
    router.push(employeeRoutes.company.detail(employeeId));
  }, [router, employeeId]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await form.handleSubmit(submit)(e);
    },
    [form, submit]
  );

  // Permission check
  if (!canUpdateEmployee) {
    return <AccessDenied message="You do not have permission to edit employees." />;
  }

  // Loading state
  if (isLoading) {
    return <Loader message="Loading employee details..." />;
  }

  // Error state
  if (isError || !employee) {
    return (
      <ErrorState
        message={error?.message || "Failed to load employee details"}
        onRetry={refetch}
      />
    );
  }

  return (
    <EmployeeEditForm
      form={form}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      isLoading={isSubmitting}
      employee={employee}
    />
  );
}


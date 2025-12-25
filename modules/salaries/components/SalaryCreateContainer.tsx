// Salary Create Container
// Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthContext } from "@/context";
import { useSalaryCreateForm, useSalaryFormSubmit } from "@/modules/salaries/forms";
import { useGetEmployee } from "@/hooks/useEmployees";
import { SalaryCreateForm } from "./SalaryCreateForm";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { salaryRoutes } from "@/utils/routes/salary.routes";

export function SalaryCreateContainer() {
  const params = useParams();
  const router = useRouter();
  const { canAccessSalary } = useAuthContext();
  const employeeId = params?.id as string;

  // Access control check
  if (!canAccessSalary) {
    return <AccessDenied message="Only CEO and HR can create salary." />;
  }

  // Fetch employee data for name
  const employeeQuery = useGetEmployee(employeeId);

  // Form hook
  const form = useSalaryCreateForm();

  // Form submit hook (following R10)
  const { submit: submitSalary, isLoading: isSubmitting } = useSalaryFormSubmit({
    form,
    employeeId,
    isRevise: false, // This is for creating, not revising
    currentSalary: null,
  });

  // Handlers
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Trigger validation
      const isValid = await form.trigger();
      if (!isValid) {
        return;
      }

      try {
        const formValues = form.getValues();
        await submitSalary(formValues);
        // Navigate back to salary overview on success
        router.push(salaryRoutes.company.overview(employeeId));
      } catch (error) {
        // Error handling is done in submit hook
      }
    },
    [form, submitSalary, router, employeeId]
  );

  const handleCancel = useCallback(() => {
    router.push(salaryRoutes.company.overview(employeeId));
  }, [router, employeeId]);

  // Loading state
  if (employeeQuery.isLoading) {
    return <Loader message="Loading employee information..." />;
  }

  // Error state
  if (employeeQuery.isError) {
    return (
      <ErrorState
        message={employeeQuery.error?.message || "Failed to load employee information"}
        onRetry={() => employeeQuery.refetch()}
      />
    );
  }

  const employeeName =
    employeeQuery.data?.data?.user?.first_name &&
    employeeQuery.data?.data?.user?.last_name
      ? `${employeeQuery.data.data.user.first_name} ${employeeQuery.data.data.user.last_name}`
      : employeeQuery.data?.data?.user?.email || "Employee";

  // Map form errors
  const formErrors = Object.fromEntries(
    Object.entries(form.formState.errors).map(([key, error]) => [
      key,
      error?.message || "",
    ])
  );

  return (
    <div style={{ padding: "24px" }}>
      <h1 style={{ marginBottom: "24px", fontSize: "24px", fontWeight: "bold" }}>
        Create Salary for {employeeName}
      </h1>
      <SalaryCreateForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={isSubmitting}
        errors={formErrors}
        rootError={form.formState.errors.root?.message}
      />
    </div>
  );
}


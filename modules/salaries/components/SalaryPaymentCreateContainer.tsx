// Salary Payment Create Container
// SCR_SALARY_PAYMENT_CREATE - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSalaryDetail } from "@/hooks/useSalaryDetail";
import { useAuthContext } from "@/context";
import { useSalaryPaymentForm, useSalaryPaymentFormSubmit } from "@/modules/salaries/forms";
import { useGetEmployee } from "@/hooks/useEmployees";
import { SalaryPaymentCreateForm } from "./SalaryPaymentCreateForm";
import { SalaryPaymentConfirmationModal } from "./SalaryPaymentConfirmationModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { salaryRoutes } from "@/utils/routes/salary.routes";
import {
  formatCurrency,
  formatPaymentPeriodLabel,
  getCurrencySymbol,
  getPaymentMethodLabel,
} from "@/hooks/useSalaryTransformations";

export function SalaryPaymentCreateContainer() {
  const params = useParams();
  const router = useRouter();
  const { canAccessSalary } = useAuthContext();
  const employeeId = params?.id as string;

  // Access control check
  if (!canAccessSalary) {
    return <AccessDenied message="Only CEO and HR can create salary payments." />;
  }

  // Fetch employee data for name
  const employeeQuery = useGetEmployee(employeeId);

  // Data hooks
  const salaryDetail = useSalaryDetail(employeeId);

  // Form hook
  const form = useSalaryPaymentForm();

  // Form submit hook (following R10)
  const { submit: submitPayment, isLoading: isSubmitting } = useSalaryPaymentFormSubmit({
    form,
    employeeId,
  });

  // Modal state
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  // Computed values
  const payableAmount = useMemo(() => {
    if (!salaryDetail.salary) return "0.00";
    return salaryDetail.salary.amount;
  }, [salaryDetail.salary]);

  const currencySymbol = useMemo(() => {
    if (!salaryDetail.salary) return "₹";
    return salaryDetail.salary.currencySymbol;
  }, [salaryDetail.salary]);

  // Watch form values properly for useMemo dependencies
  const month = form.watch("month");
  const year = form.watch("year");
  const paymentMethod = form.watch("payment_method");

  const paymentPeriod = useMemo(() => {
    return formatPaymentPeriodLabel(month, year);
  }, [month, year]);

  const paymentMethodLabel = useMemo(() => {
    return getPaymentMethodLabel(paymentMethod);
  }, [paymentMethod]);

  // Handlers
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!form.formState.isValid) {
        return;
      }

      // Open confirmation modal
      setIsConfirmationModalOpen(true);
    },
    [form]
  );

  const handleConfirm = useCallback(async () => {
    try {
      const formValues = form.getValues();
      await submitPayment(formValues);
      setIsConfirmationModalOpen(false);
      // Navigation is handled in submit hook
    } catch (error) {
      // Error handling is done in submit hook
      // Modal stays open on error
    }
  }, [form, submitPayment]);

  const handleCancel = useCallback(() => {
    router.push(salaryRoutes.company.overview(employeeId));
  }, [router, employeeId]);

  // Loading state
  if (salaryDetail.isLoading || employeeQuery.isLoading) {
    return <Loader message="Loading salary information..." />;
  }

  // Error state
  if (salaryDetail.isError) {
    return (
      <ErrorState
        message={salaryDetail.error?.message || "Failed to load salary information"}
        onRetry={salaryDetail.refetch}
      />
    );
  }

  // No active salary
  if (!salaryDetail.hasActiveSalary || !salaryDetail.salary) {
    return (
      <ErrorState
        message="No active salary configuration found. Please configure salary first."
        onRetry={salaryDetail.refetch}
      />
    );
  }

  const employeeName =
    employeeQuery.data?.data?.user?.first_name &&
    employeeQuery.data?.data?.user?.last_name
      ? `${employeeQuery.data.data.user.first_name} ${employeeQuery.data.data.user.last_name}`
      : employeeQuery.data?.data?.user?.email || "Employee";

  const formattedAmount = formatCurrency(payableAmount, salaryDetail.salary.currency);

  return (
    <>
      <SalaryPaymentCreateForm
        form={form}
        payableAmount={payableAmount}
        currencySymbol={currencySymbol}
        paymentPeriod={paymentPeriod}
        isLoading={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        errors={Object.fromEntries(
          Object.entries(form.formState.errors).map(([key, error]) => [
            key,
            error?.message || "",
          ])
        )}
        rootError={form.formState.errors.root?.message}
      />

      <SalaryPaymentConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirm}
        employeeName={employeeName}
        paymentPeriod={paymentPeriod}
        payableAmount={formattedAmount.replace(currencySymbol, "")}
        currencySymbol={currencySymbol}
        paymentMethod={paymentMethodLabel}
        isLoading={isSubmitting}
      />
    </>
  );
}


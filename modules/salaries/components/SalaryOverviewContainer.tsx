// Salary Overview Container
// SCR_EMPLOYEE_SALARY_OVERVIEW - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSalaryDetail } from "@/hooks/useSalaryDetail";
import { useSalaryHistory } from "@/hooks/useSalaryHistory";
import { useBankInfoDetail } from "@/hooks/useBankInfoDetail";
import { useSalaryPaymentList } from "@/hooks/useSalaryPaymentList";
import { useAuthContext } from "@/context";
import { useBankInfoForm, useBankInfoFormSubmit, useSalaryCreateForm, useSalaryFormSubmit } from "@/modules/salaries/forms";
import { useGetEmployee } from "@/hooks/useEmployees";
import { SalaryOverview } from "./SalaryOverview";
import { SalaryUpdateConfirmationModal } from "./SalaryUpdateConfirmationModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { salaryRoutes } from "@/utils/routes/salary.routes";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import type { SalaryCreate, SalaryRevise } from "@/utils/types/requests/salary";

export function SalaryOverviewContainer() {
  const params = useParams();
  const router = useRouter();
  const { canAccessSalary } = useAuthContext();
  const employeeId = params?.id as string;

  // Access control check
  if (!canAccessSalary) {
    return <AccessDenied message="Only CEO and HR can access salary information." />;
  }

  // Fetch employee data for name
  const employeeQuery = useGetEmployee(employeeId);

  // Data hooks
  const salaryDetail = useSalaryDetail(employeeId);
  const salaryHistory = useSalaryHistory(employeeId);
  const bankInfoDetail = useBankInfoDetail(employeeId);
  const [paymentPage, setPaymentPage] = useState(1);
  const paymentList = useSalaryPaymentList({
    employee_id: employeeId,
    initialParams: { page: paymentPage, page_size: 20 },
  });

  // Form hooks
  const salaryCreateForm = useSalaryCreateForm();
  const bankInfoForm = useBankInfoForm();

  // Form submit hooks (following R10)
  const { submit: submitSalary, isLoading: isSubmittingSalary } = useSalaryFormSubmit({
    form: salaryCreateForm,
    employeeId,
    isRevise: !!salaryDetail.rawSalary,
    currentSalary: salaryDetail.rawSalary || undefined,
  });

  const { submit: submitBankInfo, isLoading: isSubmittingBankInfo } =
    useBankInfoFormSubmit({
      form: bankInfoForm,
      employeeId,
      isUpdate: bankInfoDetail.hasBankInfo,
      currentBankInfo: bankInfoDetail.rawBankInfo || undefined,
    });

  // Modal states
  const [isSalaryUpdateModalOpen, setIsSalaryUpdateModalOpen] = useState(false);
  const [pendingSalaryUpdate, setPendingSalaryUpdate] = useState<{
    type: "create" | "revise";
    payload: SalaryCreate | SalaryRevise;
  } | null>(null);

  // Populate bank info form when data loads
  useEffect(() => {
    if (bankInfoDetail.bankInfo) {
      bankInfoForm.reset({
        bank_name: bankInfoDetail.bankInfo.bank_name,
        branch: bankInfoDetail.bankInfo.branch,
        account_number: bankInfoDetail.bankInfo.account_number?.replace(/\*/g, "") || "",
        ifsc_code: bankInfoDetail.bankInfo.ifsc_code?.replace(/\*/g, "") || "",
      });
    }
  }, [bankInfoDetail.bankInfo, bankInfoForm]);

  // Handlers
  const handleInitiatePayment = useCallback(() => {
    router.push(salaryRoutes.company.paymentCreate(employeeId));
  }, [router, employeeId]);

  const handleCreateSalary = useCallback(() => {
    // Navigate to salary creation page
    router.push(salaryRoutes.company.create(employeeId));
  }, [router, employeeId]);

  const handleUpdateSalary = useCallback(() => {
    // Navigate to salary revision page
    router.push(salaryRoutes.company.revise(employeeId));
  }, [router, employeeId]);

  const handleSalaryUpdateConfirm = useCallback(async () => {
    if (!pendingSalaryUpdate) return;

    try {
      // Update form with pending values
      salaryCreateForm.reset(pendingSalaryUpdate.payload as SalaryCreate);
      
      // Submit using form submit hook
      await submitSalary(pendingSalaryUpdate.payload as SalaryCreate);

      setIsSalaryUpdateModalOpen(false);
      setPendingSalaryUpdate(null);
      salaryDetail.refetch();
      salaryHistory.refetch();
    } catch (error) {
      // Error handling is done in submit hook
    }
  }, [pendingSalaryUpdate, salaryCreateForm, submitSalary, salaryDetail, salaryHistory]);

  const handleUpdateBankInfo = useCallback(async () => {
    // Use form.handleSubmit to trigger validation before submission
    // This ensures validation runs and errors are displayed if validation fails
    const isValid = await bankInfoForm.trigger(); // Trigger validation for all fields
    
    if (!isValid) {
      // Validation failed - errors are already set by trigger()
      // The form will display validation errors automatically
      return;
    }

    try {
      const formValues = bankInfoForm.getValues();
      await submitBankInfo(formValues);
      // Refetch bank info to get updated data
      await bankInfoDetail.refetch();
      // Close edit mode after successful save
      // The form will be reset by the useEffect when bankInfoDetail updates
    } catch (error) {
      // Error handling is done in submit hook
      // Errors are mapped to form fields automatically
    }
  }, [bankInfoForm, submitBankInfo, bankInfoDetail]);

  const handleAddBankInfo = useCallback(() => {
    // Scroll to bank info section and trigger edit mode
    // The BankInfoSection component will handle the edit mode
    // We can trigger it by setting the form to empty and the section will show edit form
    bankInfoForm.reset();
    // Scroll to bank info section
    setTimeout(() => {
      const bankInfoSection = document.getElementById("bank-info-section");
      if (bankInfoSection) {
        bankInfoSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [bankInfoForm]);

  const handleCancelBankInfo = useCallback(() => {
    if (bankInfoDetail.bankInfo) {
      bankInfoForm.reset({
        bank_name: bankInfoDetail.bankInfo.bank_name,
        branch: bankInfoDetail.bankInfo.branch,
        account_number: bankInfoDetail.bankInfo.account_number?.replace(/\*/g, "") || "",
        ifsc_code: bankInfoDetail.bankInfo.ifsc_code?.replace(/\*/g, "") || "",
      });
    } else {
      bankInfoForm.reset();
    }
  }, [bankInfoForm, bankInfoDetail.bankInfo]);

  const handleDownloadSlip = useCallback((paymentId: string, slipUrl: string) => {
    // Open slip URL in new tab
    window.open(slipUrl, "_blank");
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setPaymentPage(page);
  }, []);

  // Loading state
  const isLoading =
    salaryDetail.isLoading ||
    salaryHistory.isLoading ||
    bankInfoDetail.isLoading ||
    paymentList.isLoading ||
    employeeQuery.isLoading;

  if (isLoading) {
    return <Loader message="Loading salary information..." />;
  }

  // Error state
  if (salaryDetail.isError || salaryHistory.isError || bankInfoDetail.isError) {
    return (
      <ErrorState
        message={
          salaryDetail.error?.message ||
          salaryHistory.error?.message ||
          bankInfoDetail.error?.message ||
          "Failed to load salary information"
        }
        onRetry={() => {
          salaryDetail.refetch();
          salaryHistory.refetch();
          bankInfoDetail.refetch();
        }}
      />
    );
  }

  const employeeName =
    employeeQuery.data?.data?.user?.first_name &&
    employeeQuery.data?.data?.user?.last_name
      ? `${employeeQuery.data.data.user.first_name} ${employeeQuery.data.data.user.last_name}`
      : employeeQuery.data?.data?.user?.email || "Employee";

  return (
    <>
      <SalaryOverview
        employeeId={employeeId}
        employeeName={employeeName}
        salary={salaryDetail.salary}
        hasActiveSalary={salaryDetail.hasActiveSalary}
        canRevise={salaryDetail.canRevise}
        history={salaryHistory.history}
        hasHistory={salaryHistory.hasHistory}
        bankInfo={bankInfoDetail.bankInfo}
        hasBankInfo={bankInfoDetail.hasBankInfo}
        canUpdateBankInfo={bankInfoDetail.canUpdate}
        bankInfoForm={bankInfoForm}
        payments={paymentList.payments}
        hasPayments={paymentList.hasPayments}
        pagination={paymentList.pagination}
        isLoadingSalary={salaryDetail.isLoading}
        isLoadingHistory={salaryHistory.isLoading}
        isLoadingBankInfo={bankInfoDetail.isLoading}
        isLoadingPayments={paymentList.isLoading}
        onInitiatePayment={handleInitiatePayment}
        onUpdateSalary={handleUpdateSalary}
        onCreateSalary={handleCreateSalary}
        onAddBankInfo={handleAddBankInfo}
        onUpdateBankInfo={handleUpdateBankInfo}
        onCancelBankInfo={handleCancelBankInfo}
        onDownloadSlip={handleDownloadSlip}
        onPageChange={handlePageChange}
        isUpdatingBankInfo={isSubmittingBankInfo}
        bankInfoErrors={Object.fromEntries(
          Object.entries(bankInfoForm.formState.errors).map(([key, error]) => [
            key,
            error?.message || "",
          ])
        )}
      />

      {isSalaryUpdateModalOpen && salaryDetail.salary && (
        <SalaryUpdateConfirmationModal
          isOpen={isSalaryUpdateModalOpen}
          onClose={() => {
            setIsSalaryUpdateModalOpen(false);
            setPendingSalaryUpdate(null);
          }}
          onConfirm={handleSalaryUpdateConfirm}
          previousSalary={salaryDetail.salary}
          newSalary={{
            amount: "0", // Would come from form in real implementation
            currencySymbol: salaryDetail.salary.currencySymbol,
            effectiveFrom: new Date().toISOString().split("T")[0],
          }}
          isLoading={isSubmittingSalary}
        />
      )}
    </>
  );
}


// Salary Overview UI Component
// SCR_EMPLOYEE_SALARY_OVERVIEW - Pure UI component following R7
// Composes UI primitives following R16
// Following R17 UX Intent: Visual hierarchy with PRIMARY, SECONDARY, TERTIARY sections

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ActiveSalaryCard } from "./ActiveSalaryCard";
import { SalaryHistorySection } from "./SalaryHistorySection";
import { BankInfoSection } from "./BankInfoSection";
import { SalaryPaymentHistoryTable } from "./SalaryPaymentHistoryTable";
import { spacing, typography, colors } from "@/theme/tokens";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import type { TransformedSalaryDetails } from "@/hooks/useSalaryTransformations";
import type { TransformedSalaryHistory } from "@/hooks/useSalaryTransformations";
import type { TransformedBankInfo } from "@/hooks/useSalaryTransformations";
import type { TransformedSalaryPayment } from "@/hooks/useSalaryTransformations";
import type { BankInfoFormSchema } from "@/modules/salaries/forms";
import { UseFormReturn } from "react-hook-form";

interface SalaryOverviewProps {
  employeeId: string;
  employeeName: string;
  // PRIMARY: Active Salary
  salary: TransformedSalaryDetails | null;
  hasActiveSalary: boolean;
  canRevise: boolean;
  // TERTIARY: Salary History
  history: TransformedSalaryHistory[];
  hasHistory: boolean;
  // TERTIARY: Bank Info
  bankInfo: TransformedBankInfo | null;
  hasBankInfo: boolean;
  canUpdateBankInfo: boolean;
  bankInfoForm: UseFormReturn<BankInfoFormSchema>;
  // SECONDARY: Payment History
  payments: TransformedSalaryPayment[];
  hasPayments: boolean;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  // Loading states
  isLoadingSalary?: boolean;
  isLoadingHistory?: boolean;
  isLoadingBankInfo?: boolean;
  isLoadingPayments?: boolean;
  // Actions
  onInitiatePayment?: () => void;
  onUpdateSalary?: () => void;
  onCreateSalary?: () => void; // Separate handler for creating new salary
  onAddBankInfo?: () => void; // New action for adding bank info
  onUpdateBankInfo?: () => void;
  onCancelBankInfo?: () => void;
  onDownloadSlip?: (paymentId: string, slipUrl: string) => void;
  onPageChange?: (page: number) => void;
  // Form states
  isUpdatingBankInfo?: boolean;
  bankInfoErrors?: Record<string, string>;
}

export const SalaryOverview = React.memo(function SalaryOverview({
  employeeId,
  employeeName,
  salary,
  hasActiveSalary,
  canRevise,
  history,
  hasHistory,
  bankInfo,
  hasBankInfo,
  canUpdateBankInfo,
  bankInfoForm,
  payments,
  hasPayments,
  pagination,
  isLoadingSalary = false,
  isLoadingHistory = false,
  isLoadingBankInfo = false,
  isLoadingPayments = false,
  onInitiatePayment,
  onUpdateSalary,
  onCreateSalary,
  onAddBankInfo,
  onUpdateBankInfo,
  onCancelBankInfo,
  onDownloadSlip,
  onPageChange,
  isUpdatingBankInfo = false,
  bankInfoErrors = {},
}: SalaryOverviewProps) {
  // Memoized styles following R12 (Figma alignment)
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[6],
      display: "inline-block",
    } as const),
    []
  );

  const pageTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing[8],
    } as const),
    []
  );

  const sectionSpacingStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const loadingTextStyle = useMemo(
    () => ({
      color: colors.textMuted,
    } as const),
    []
  );

  // PRIMARY: Active Salary Card (Dominant)
  const renderActiveSalary = () => {
    if (isLoadingSalary) {
      return (
        <Card padding="lg">
          <p style={loadingTextStyle}>Loading salary information...</p>
        </Card>
      );
    }

    if (!hasActiveSalary) {
      // If no bank info exists, show "Add Bank Info" instead of "Create Salary"
      // Bank info is required before salary can be created
      if (!hasBankInfo && onAddBankInfo) {
        return (
          <Card padding="lg">
            <EmptyState
              message="Bank Information Required"
              description="Please add bank information before creating a salary configuration. Bank details are required for salary payments."
              actionText="Add Bank Information"
              onActionClick={onAddBankInfo}
            />
          </Card>
        );
      }

      // If bank info exists but no salary, show "Create Salary" button
      // onCreateSalary handler exists means user can create salary (CEO/HR)
      if (!onCreateSalary) {
        return null;
      }
      
      const buttonContainerStyle = useMemo(() => ({
        display: "flex",
        justifyContent: "center" as const,
        alignItems: "center" as const,
        padding: spacing[8],
      } as const), []);
      
      return (
        <Card padding="lg">
          <div style={buttonContainerStyle}>
            <Button
              variant="primary"
              size="lg"
              onClick={onCreateSalary}
            >
              Create Salary
            </Button>
          </div>
        </Card>
      );
    }

    if (!salary) return null;

    return (
      <ActiveSalaryCard
        salary={salary}
        onInitiatePayment={onInitiatePayment}
        onUpdateSalary={onUpdateSalary}
        canInitiatePayment={hasActiveSalary && !!onInitiatePayment}
        canUpdateSalary={canRevise}
      />
    );
  };

  return (
    <div style={containerStyle}>
      {/* Back Link */}
      <Link
        href={employeeRoutes.company.detail(employeeId)}
        style={backLinkStyle}
      >
        ← Back to Employee Details
      </Link>

      {/* Page Title */}
      <h1 style={pageTitleStyle}>
        Salary Management - {employeeName}
      </h1>

      {/* PRIMARY: Active Salary Card (Dominant) */}
      <div style={sectionSpacingStyle}>{renderActiveSalary()}</div>

      {/* SECONDARY: Payment History Table (Supporting, always visible) */}
      <SalaryPaymentHistoryTable
        payments={payments}
        isLoading={isLoadingPayments}
        onDownloadSlip={onDownloadSlip}
        pagination={pagination}
        onPageChange={onPageChange}
      />

      {/* TERTIARY: Salary History Section (Collapsible, less prominent) */}
      <SalaryHistorySection
        history={history}
        isLoading={isLoadingHistory}
      />

      {/* TERTIARY: Bank Information Section (Collapsible, less prominent) */}
      <BankInfoSection
        bankInfo={bankInfo}
        form={bankInfoForm}
        isLoading={isLoadingBankInfo}
        isSubmitting={isUpdatingBankInfo}
        canUpdate={canUpdateBankInfo}
        onUpdate={onUpdateBankInfo}
        onCancel={onCancelBankInfo}
        errors={bankInfoErrors}
      />
    </div>
  );
});


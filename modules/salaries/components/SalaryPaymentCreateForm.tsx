// Salary Payment Create Form Component
// Pure UI form component - R16 Layer 2
// Composes form inputs following R10 (React Hook Form)

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { PaymentAmountDisplay } from "./PaymentAmountDisplay";
import { PaymentPeriodSelector } from "./PaymentPeriodSelector";
import { spacing, typography, colors } from "@/theme/tokens";
import type { SalaryPaymentCreateFormSchema } from "@/modules/salaries/forms";
import { UseFormReturn } from "react-hook-form";

interface SalaryPaymentCreateFormProps {
  form: UseFormReturn<SalaryPaymentCreateFormSchema>;
  payableAmount: string;
  currencySymbol: string;
  paymentPeriod: string;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  errors?: Record<string, string>;
  rootError?: string;
}

// Payment method options
const PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "UPI", label: "UPI" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "CASH", label: "Cash" },
];

export const SalaryPaymentCreateForm = React.memo(
  function SalaryPaymentCreateForm({
    form,
    payableAmount,
    currencySymbol,
    paymentPeriod,
    isLoading = false,
    onSubmit,
  onCancel,
  errors = {},
  rootError,
}: SalaryPaymentCreateFormProps) {
    const { register, watch, formState } = form;
    const formValues = watch();

    // Memoized styles following R12 (Figma alignment)
    const containerStyle = useMemo(
      () => ({
        maxWidth: "800px",
        margin: "0 auto",
        padding: spacing[8],
      } as const),
      []
    );

    const sectionStyle = useMemo(
      () => ({
        marginBottom: spacing[8],
      } as const),
      []
    );

    const labelStyle = useMemo(
      () => ({
        display: "block",
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.medium,
        color: colors.textPrimary,
        marginBottom: spacing[2],
      } as const),
      []
    );

  const actionsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[8],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const rootErrorStyle = useMemo(
    () => ({
      padding: spacing[4],
      backgroundColor: colors.errorBg,
      color: colors.errorText,
      borderRadius: "8px",
      marginBottom: spacing[4],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

    return (
      <div style={containerStyle}>
        <form onSubmit={onSubmit}>
          {/* PRIMARY: Payment Amount Display */}
          <div style={sectionStyle}>
            <PaymentAmountDisplay
              amount={payableAmount}
              currencySymbol={currencySymbol}
              paymentPeriod={paymentPeriod}
            />
          </div>

          {/* SECONDARY: Payment Period Selector */}
          <div style={sectionStyle}>
            <Card padding="md">
              <h3 style={sectionTitleStyle}>
                Payment Details
              </h3>
              <PaymentPeriodSelector
                month={formValues.month}
                year={formValues.year}
                onMonthChange={(month) => form.setValue("month", month)}
                onYearChange={(year) => form.setValue("year", year)}
                monthError={errors.month}
                yearError={errors.year}
              />
            </Card>
          </div>

          {/* SECONDARY: Payment Method */}
          <div style={sectionStyle}>
            <Card padding="md">
              <label style={labelStyle}>Payment Method</label>
              <Select
                {...register("payment_method")}
                options={PAYMENT_METHOD_OPTIONS}
                error={!!errors.payment_method}
                errorMessage={errors.payment_method}
              />
            </Card>
          </div>

          {/* Root Error Display */}
          {rootError && (
            <div style={rootErrorStyle}>
              {rootError}
            </div>
          )}

          {/* TERTIARY: Actions */}
          <div style={actionsStyle}>
            {onCancel && (
              <Button
                type="button"
                variant="secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={!formState.isValid}
            >
              Confirm Payment
            </Button>
          </div>
        </form>
      </div>
    );
  }
);


// Salary Create Form Component
// Pure UI form component - R16 Layer 2
// Composes form inputs following R10 (React Hook Form)

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { spacing, typography, colors } from "@/theme/tokens";
import type { SalaryCreateFormSchema } from "@/modules/salaries/forms";
import { UseFormReturn, Controller } from "react-hook-form";

interface SalaryCreateFormProps {
  form: UseFormReturn<SalaryCreateFormSchema>;
  isLoading?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  errors?: Record<string, string>;
  rootError?: string;
  submitButtonText?: string;
}

// Currency options
const CURRENCY_OPTIONS = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "AUD", label: "AUD (A$)" },
  { value: "CAD", label: "CAD (C$)" },
];

// Payment frequency options
const PAYMENT_FREQUENCY_OPTIONS = [
  { value: "MONTHLY", label: "Monthly" },
  { value: "BI_WEEKLY", label: "Bi-Weekly" },
  { value: "WEEKLY", label: "Weekly" },
];

export const SalaryCreateForm = React.memo(function SalaryCreateForm({
  form,
  isLoading = false,
  onSubmit,
  onCancel,
  errors = {},
  rootError,
  submitButtonText = "Create Salary",
}: SalaryCreateFormProps) {
  const { register, watch, formState, control } = form;
  const formValues = watch();

  // Merge form state errors with prop errors
  const mergedErrors = useMemo(() => {
    const formErrors = formState.errors;
    return {
      amount: formErrors.amount?.message || errors.amount,
      currency: formErrors.currency?.message || errors.currency,
      payment_frequency: formErrors.payment_frequency?.message || errors.payment_frequency,
      effective_from: formErrors.effective_from?.message || errors.effective_from,
      effective_to: formErrors.effective_to?.message || errors.effective_to,
    };
  }, [formState.errors, errors]);

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
      marginBottom: spacing[6],
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

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: spacing[4],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <form onSubmit={onSubmit}>
        {/* PRIMARY: Salary Details */}
        <div style={sectionStyle}>
          <Card padding="lg">
            <h3 style={sectionTitleStyle}>Salary Details</h3>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Amount *</label>
                <Input
                  {...register("amount")}
                  type="text"
                  placeholder="50000.00"
                  error={!!mergedErrors.amount}
                  errorMessage={mergedErrors.amount}
                />
              </div>
              <div>
                <label style={labelStyle}>Currency *</label>
                <Controller
                  name="currency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={CURRENCY_OPTIONS}
                      error={!!mergedErrors.currency}
                      errorMessage={mergedErrors.currency}
                    />
                  )}
                />
              </div>
              <div>
                <label style={labelStyle}>Payment Frequency *</label>
                <Controller
                  name="payment_frequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={PAYMENT_FREQUENCY_OPTIONS}
                      error={!!mergedErrors.payment_frequency}
                      errorMessage={mergedErrors.payment_frequency}
                    />
                  )}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* SECONDARY: Effective Dates */}
        <div style={sectionStyle}>
          <Card padding="lg">
            <h3 style={sectionTitleStyle}>Effective Period</h3>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Effective From *</label>
                <Input
                  {...register("effective_from")}
                  type="date"
                  error={!!mergedErrors.effective_from}
                  errorMessage={mergedErrors.effective_from}
                />
              </div>
              <div>
                <label style={labelStyle}>Effective To (Optional)</label>
                <Input
                  {...register("effective_to")}
                  type="date"
                  error={!!mergedErrors.effective_to}
                  errorMessage={mergedErrors.effective_to}
                />
              </div>
            </div>
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
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
});


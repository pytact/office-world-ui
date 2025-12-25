// Bank Info Section Component
// Feature-specific component - R16 Layer 2
// Collapsible section for bank information (TERTIARY visual hierarchy)
// Following R17 UX Intent: Collapsible, less prominent

"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { EmptyState } from "@/components/ui/EmptyState";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedBankInfo } from "@/hooks/useSalaryTransformations";
import type { BankInfoFormSchema } from "@/modules/salaries/forms";
import { UseFormReturn, Controller } from "react-hook-form";

interface BankInfoSectionProps {
  bankInfo: TransformedBankInfo | null;
  form: UseFormReturn<BankInfoFormSchema>;
  isLoading?: boolean;
  isSubmitting?: boolean;
  canUpdate?: boolean;
  onUpdate?: () => void;
  onCancel?: () => void;
  errors?: Record<string, string>;
}

// Bank name options
const BANK_OPTIONS = [
  { value: "HDFC", label: "HDFC Bank" },
  { value: "ICICI", label: "ICICI Bank" },
  { value: "SBI", label: "State Bank of India" },
  { value: "AXIS", label: "Axis Bank" },
  { value: "KOTAK", label: "Kotak Mahindra Bank" },
  { value: "PNB", label: "Punjab National Bank" },
  { value: "BOB", label: "Bank of Baroda" },
];

export const BankInfoSection = React.memo(function BankInfoSection({
  bankInfo,
  form,
  isLoading = false,
  isSubmitting = false,
  canUpdate = false,
  onUpdate,
  onCancel,
  errors = {},
}: BankInfoSectionProps) {
  // Bank info should be expanded by default for better visibility
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const { register, watch, setValue, formState, control } = form;
  const formValues = watch();
  
  // Merge prop errors with form state errors
  // Form state errors take precedence (from validation)
  const mergedErrors = useMemo(() => {
    const formErrors = formState.errors;
    return {
      bank_name: formErrors.bank_name?.message || errors.bank_name,
      branch: formErrors.branch?.message || errors.branch,
      account_number: formErrors.account_number?.message || errors.account_number,
      ifsc_code: formErrors.ifsc_code?.message || errors.ifsc_code,
    };
  }, [formState.errors, errors]);

  // Memoized styles following R12 (Figma alignment)
  const sectionStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      margin: 0,
    } as const),
    []
  );

  const infoGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: spacing[4],
    } as const),
    []
  );

  const infoItemStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    } as const),
    []
  );

  const valueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const actionsStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[3],
      marginTop: spacing[4],
    } as const),
    []
  );

  const handleEdit = useCallback(() => {
    if (bankInfo) {
      setValue("bank_name", bankInfo.bank_name);
      setValue("branch", bankInfo.branch);
      setValue("account_number", bankInfo.account_number.replace(/\*/g, "")); // Unmask for editing
      setValue("ifsc_code", bankInfo.ifsc_code.replace(/\*/g, "")); // Unmask for editing
    } else {
      // If no bank info, clear form for new entry
      // Set default bank name to first option (HDFC) to avoid validation error
      setValue("bank_name", "HDFC");
      setValue("branch", "");
      setValue("account_number", "");
      setValue("ifsc_code", "");
    }
    setIsEditing(true);
  }, [bankInfo, setValue]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Close edit mode when bank info is successfully created/updated
  // Track previous submitting state to detect when submission completes
  const prevSubmittingRef = React.useRef<boolean>(isSubmitting);
  
  useEffect(() => {
    // When submission completes (isSubmitting goes from true to false)
    // and bank info exists, close edit mode
    const wasSubmitting = prevSubmittingRef.current;
    const isNowSubmitting = isSubmitting;
    
    if (wasSubmitting && !isNowSubmitting && bankInfo && isEditing) {
      // Submission just completed and bank info exists - save was successful
      setIsEditing(false);
    }
    
    // Update ref for next render
    prevSubmittingRef.current = isSubmitting;
  }, [isSubmitting, bankInfo, isEditing]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  if (isLoading) {
    return (
      <div style={sectionStyle}>
        <Card padding="md">
          <p style={valueStyle}>Loading bank information...</p>
        </Card>
      </div>
    );
  }

  return (
    <div id="bank-info-section" style={sectionStyle}>
      <div style={headerStyle}>
        <h3 style={titleStyle}>Bank Information</h3>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleToggleExpand}
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {isExpanded && (
        <Card padding="md">
          {!bankInfo && !isEditing ? (
            <EmptyState
              message="No Bank Information"
              description="Bank information has not been configured yet."
              actionText={canUpdate ? "Add Bank Information" : undefined}
              onActionClick={canUpdate ? handleEdit : undefined}
            />
          ) : isEditing ? (
            <div>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Bank Name</label>
                  <Controller
                    name="bank_name"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={BANK_OPTIONS}
                        error={!!mergedErrors.bank_name}
                        errorMessage={mergedErrors.bank_name}
                      />
                    )}
                  />
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Branch</label>
                  <Input
                    {...register("branch")}
                    error={!!mergedErrors.branch}
                    errorMessage={mergedErrors.branch}
                  />
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>Account Number</label>
                  <Input
                    {...register("account_number")}
                    error={!!mergedErrors.account_number}
                    errorMessage={mergedErrors.account_number}
                    placeholder="Enter account number"
                  />
                </div>
                <div style={infoItemStyle}>
                  <label style={labelStyle}>IFSC Code</label>
                  <Input
                    {...register("ifsc_code")}
                    error={!!mergedErrors.ifsc_code}
                    errorMessage={mergedErrors.ifsc_code}
                    placeholder="HDFC0001234"
                    style={{ textTransform: "uppercase" }}
                  />
                </div>
              </div>
              <div style={actionsStyle}>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onUpdate}
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div style={infoGridStyle}>
                <div style={infoItemStyle}>
                  <span style={labelStyle}>Bank Name</span>
                  <span style={valueStyle}>{bankInfo?.bank_name || "—"}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={labelStyle}>Branch</span>
                  <span style={valueStyle}>{bankInfo?.branch || "—"}</span>
                </div>
                <div style={infoItemStyle}>
                  <span style={labelStyle}>Account Number</span>
                  <span style={valueStyle}>
                    {bankInfo?.accountNumberDisplay || "—"}
                  </span>
                </div>
                <div style={infoItemStyle}>
                  <span style={labelStyle}>IFSC Code</span>
                  <span style={valueStyle}>
                    {bankInfo?.ifscCodeDisplay || "—"}
                  </span>
                </div>
              </div>
              {canUpdate && (
                <div style={actionsStyle}>
                  <Button variant="secondary" size="md" onClick={handleEdit}>
                    Update Bank Information
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      )}
    </div>
  );
});


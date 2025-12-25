// Payment Period Selector Component
// Feature-specific component - R16 Layer 2
// Composes Select and Input primitives for month/year selection

"use client";

import React, { useMemo, useCallback } from "react";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { spacing, typography, colors } from "@/theme/tokens";

interface PaymentPeriodSelectorProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  monthError?: string;
  yearError?: string;
}

// Month options
const MONTH_OPTIONS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const PaymentPeriodSelector = React.memo(function PaymentPeriodSelector({
  month,
  year,
  onMonthChange,
  onYearChange,
  monthError,
  yearError,
}: PaymentPeriodSelectorProps) {
  // Memoized styles following R12 (Figma alignment)
  const containerStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: spacing[4],
    } as const),
    []
  );

  const handleMonthChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onMonthChange(parseInt(e.target.value, 10));
    },
    [onMonthChange]
  );

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const yearValue = parseInt(e.target.value, 10);
      if (!isNaN(yearValue)) {
        onYearChange(yearValue);
      }
    },
    [onYearChange]
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

  return (
    <div style={containerStyle}>
      <div>
        <label style={labelStyle}>
          Month
        </label>
        <Select
          value={month.toString()}
          onChange={handleMonthChange}
          options={MONTH_OPTIONS}
          error={!!monthError}
          errorMessage={monthError}
        />
      </div>
      <div>
        <label style={labelStyle}>
          Year
        </label>
        <Input
          type="number"
          value={year.toString()}
          onChange={handleYearChange}
          min={2000}
          max={9999}
          error={!!yearError}
          errorMessage={yearError}
          placeholder="YYYY"
        />
      </div>
    </div>
  );
});


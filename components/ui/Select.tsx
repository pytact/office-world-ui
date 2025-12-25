// Select Component
// Reusable UI Primitive - R16
// Enhanced with better spacing and visual feedback
// Updated to properly support React Hook Form with forwardRef

"use client";

import React from "react";
import { colors, borderRadius, spacing, typography } from "@/theme/tokens";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  errorMessage?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    {
      error = false,
      errorMessage,
      options,
      className = "",
      ...props
    },
    ref
  ) {
    // Get value from props (comes from React Hook Form register)
    const value = props.value ?? "";
    
    return (
      <div className="w-full">
        <select
          {...props}
          ref={ref}
          value={value}
          className={className}
          style={{
            backgroundColor: props.disabled
              ? colors.backgroundSecondary
              : colors.backgroundPrimary,
            border: `1px solid ${error ? colors.borderError : colors.borderDefault}`,
            borderRadius: borderRadius.md,
            padding: `${spacing[3]} ${spacing[4]}`,
            color: props.disabled ? colors.textDisabled : colors.textPrimary,
            fontSize: typography.fontSize.body,
            fontWeight: typography.fontWeight.normal,
            fontFamily: typography.fontFamily,
            width: "100%",
            outline: "none",
            cursor: props.disabled ? "not-allowed" : "pointer",
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = colors.borderFocus;
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.borderLight}`;
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error
              ? colors.borderError
              : colors.borderDefault;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {(!value || value === "") && (
            <option value="">Select an option</option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && errorMessage && (
          <p
            style={{
              color: colors.errorText,
              fontSize: typography.fontSize.small,
              marginTop: spacing[2],
              fontWeight: typography.fontWeight.medium,
            }}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

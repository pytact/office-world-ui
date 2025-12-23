// Input Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 11
// Enhanced with better spacing and visual feedback

"use client";

import React from "react";
import { colors, borderRadius, spacing, typography, shadows } from "@/theme/tokens";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      error = false,
      errorMessage,
      className = "",
      ...props
    },
    ref
  ) {
    return (
      <div className="w-full">
        <input
          ref={ref}
          {...props}
          className={className}
        style={{
          backgroundColor: props.disabled ? colors.backgroundSecondary : colors.backgroundPrimary,
          border: `1px solid ${error ? colors.borderError : colors.borderDefault}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[4]} ${spacing[5]}`,
          color: props.disabled ? colors.textDisabled : colors.textPrimary,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.normal,
          fontFamily: typography.fontFamily,
          width: "100%",
          outline: "none",
          transition: "all 0.2s ease",
        }}
        onFocus={(e) => {
          if (!error && !props.disabled) {
            e.currentTarget.style.borderColor = colors.borderFocus;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.borderLight}`;
          }
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = error ? colors.borderError : colors.borderDefault;
          e.currentTarget.style.boxShadow = "none";
        }}
      />
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


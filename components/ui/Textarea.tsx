// Textarea Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 11

"use client";

import React from "react";
import { colors, borderRadius, spacing, typography } from "@/theme/tokens";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  errorMessage?: string;
}

export function Textarea({
  error = false,
  errorMessage,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      <textarea
        {...props}
        className={className}
        style={{
          backgroundColor: props.disabled ? colors.backgroundSecondary : colors.backgroundPrimary,
          border: `1px solid ${error ? colors.borderError : colors.borderDefault}`,
          borderRadius: borderRadius.md,
          padding: `${spacing[3]} ${spacing[4]}`,
          color: props.disabled ? colors.textDisabled : colors.textPrimary,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.normal,
          fontFamily: typography.fontFamily,
          width: "100%",
          minHeight: "100px",
          resize: "vertical",
          outline: "none",
        }}
        onFocus={(e) => {
          if (!error) {
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


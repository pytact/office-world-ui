// Password Input Component
// Reusable UI Primitive - R16
// Password input with show/hide toggle button

"use client";

import React, { useState, useMemo } from "react";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  error?: boolean;
  errorMessage?: string;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(
    {
      error = false,
      errorMessage,
      className = "",
      ...props
    },
    ref
  ) {
    const [showPassword, setShowPassword] = useState(false);

  const containerStyle = useMemo(
    () => ({
      position: "relative" as const,
      width: "100%",
    }),
    []
  );

  const inputStyle = useMemo(
    () => ({
      backgroundColor: props.disabled ? colors.backgroundSecondary : colors.backgroundPrimary,
      border: `1px solid ${error ? colors.borderError : colors.borderDefault}`,
      borderRadius: borderRadius.md,
      padding: `${spacing[4]} ${spacing[12]} ${spacing[4]} ${spacing[5]}`,
      color: props.disabled ? colors.textDisabled : colors.textPrimary,
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.normal,
      fontFamily: typography.fontFamily,
      width: "100%",
      outline: "none",
      transition: "all 0.2s ease",
    }),
    [error, props.disabled]
  );

  const toggleButtonStyle = useMemo(
    () => ({
      position: "absolute" as const,
      right: spacing[3],
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: props.disabled ? "not-allowed" : "pointer",
      padding: spacing[2],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: props.disabled ? colors.textDisabled : colors.textMuted,
      transition: "color 0.2s ease",
    }),
    [props.disabled]
  );

  const eyeIconStyle = useMemo(
    () => ({
      width: "20px",
      height: "20px",
      stroke: "currentColor",
      fill: "none",
      strokeWidth: "2",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    }),
    []
  );

  return (
    <div className="w-full">
      <div style={containerStyle}>
        <input
          ref={ref}
          {...props}
          type={showPassword ? "text" : "password"}
          className={className}
          style={inputStyle}
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
        <button
          type="button"
          onClick={() => !props.disabled && setShowPassword(!showPassword)}
          disabled={props.disabled}
          style={toggleButtonStyle}
          aria-label={showPassword ? "Hide password" : "Show password"}
          onMouseEnter={(e) => {
            if (!props.disabled) {
              e.currentTarget.style.color = colors.textPrimary;
            }
          }}
          onMouseLeave={(e) => {
            if (!props.disabled) {
              e.currentTarget.style.color = colors.textMuted;
            }
          }}
        >
          {showPassword ? (
            // Eye off icon (hide password)
            <svg
              style={eyeIconStyle}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            // Eye icon (show password)
            <svg
              style={eyeIconStyle}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
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


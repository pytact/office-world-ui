// Button Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 9
// Enhanced with better visual hierarchy and professional styling

"use client";

import React from "react";
import { colors, borderRadius, spacing, typography, shadows } from "@/theme/tokens";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  style?: React.HTMLAttributes<HTMLButtonElement>["style"];
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

/**
 * Button Component with enhanced visual hierarchy
 * Primary variant: Strong, prominent actions
 * Secondary variant: Less prominent actions
 */
export function Button({
  children,
  isLoading = false,
  disabled,
  className = "",
  style,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;

  // Size-based padding
  const sizeStyles = {
    sm: {
      paddingLeft: spacing[3],
      paddingRight: spacing[3],
      paddingTop: spacing[2],
      paddingBottom: spacing[2],
      fontSize: typography.fontSize.small,
    },
    md: {
      paddingLeft: spacing[5],
      paddingRight: spacing[5],
      paddingTop: spacing[3],
      paddingBottom: spacing[3],
      fontSize: typography.fontSize.body,
    },
    lg: {
      paddingLeft: spacing[6],
      paddingRight: spacing[6],
      paddingTop: spacing[4],
      paddingBottom: spacing[4],
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.semibold,
    },
  };

  // Variant styles - Modern, clear hierarchy
  const variantStyles = {
    primary: {
      backgroundColor: isDisabled ? colors.borderDefault : colors.primary,
      color: isDisabled ? colors.textDisabled : colors.textInverse,
      boxShadow: isDisabled ? "none" : shadows.md,
      hoverBg: colors.primaryHover,
    },
    secondary: {
      backgroundColor: isDisabled ? colors.borderDefault : "transparent",
      color: isDisabled ? colors.textDisabled : colors.textPrimary,
      boxShadow: "none",
      border: `1px solid ${colors.borderDefault}`,
      hoverBg: colors.backgroundNeutral,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center font-medium cursor-pointer disabled:cursor-not-allowed ${className}`}
      style={{
        ...currentSize,
        backgroundColor: currentVariant.backgroundColor,
        color: currentVariant.color,
        boxShadow: currentVariant.boxShadow,
        border: currentVariant.border || "none",
        borderRadius: size === "lg" ? borderRadius.md : borderRadius.md,
        fontWeight: size === "lg" ? typography.fontWeight.semibold : typography.fontWeight.medium,
        fontFamily: typography.fontFamily,
        cursor: isDisabled ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.7 : 1,
        transition: "all 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = currentVariant.hoverBg;
          if (variant === "primary") {
            e.currentTarget.style.boxShadow = shadows.md;
            e.currentTarget.style.transform = "translateY(-1px)";
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.backgroundColor = currentVariant.backgroundColor;
          if (variant === "primary") {
            e.currentTarget.style.boxShadow = currentVariant.boxShadow;
            e.currentTarget.style.transform = "translateY(0)";
          }
        }
      }}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}


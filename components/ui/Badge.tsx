// Badge Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 15.3

"use client";

import React from "react";
import { colors, borderRadius, spacing, typography } from "@/theme/tokens";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    success: {
      backgroundColor: colors.successBg,
      color: colors.successText,
    },
    warning: {
      backgroundColor: colors.warningBg,
      color: colors.warningText,
    },
    error: {
      backgroundColor: colors.errorBg,
      color: colors.errorText,
    },
    info: {
      backgroundColor: colors.infoBg,
      color: colors.infoText,
    },
    default: {
      backgroundColor: colors.backgroundSecondary,
      color: colors.textPrimary,
      border: `1px solid ${colors.borderDefault}`,
    },
  };

  const style = variantStyles[variant];

  return (
    <span
      className={className}
      style={{
        ...style,
        padding: `${spacing[1]} ${spacing[3]}`,
        borderRadius: borderRadius.md,
        fontSize: typography.fontSize.small,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}


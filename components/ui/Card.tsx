// Card Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 8
// Enhanced with better visual separation and professional styling

"use client";

import React from "react";
import { colors, shadows, borderRadius, spacing } from "@/theme/tokens";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
}

export function Card({ 
  children, 
  className = "", 
  variant = "default",
  padding = "md"
}: CardProps) {
  // Padding variants
  const paddingStyles = {
    sm: spacing[4],
    md: spacing[6],
    lg: spacing[8],
  };

  // Variant styles - Modern, soft, elevated feel
  const variantStyles = {
    default: {
      boxShadow: shadows.card,
      border: "none",
    },
    elevated: {
      boxShadow: shadows.elevated,
      border: "none",
    },
    outlined: {
      boxShadow: "none",
      border: `1px solid ${colors.borderLight}`,
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div
      className={className}
      style={{
        backgroundColor: colors.backgroundPrimary,
        boxShadow: currentVariant.boxShadow,
        borderRadius: borderRadius.lg,
        padding: paddingStyles[padding],
        border: currentVariant.border,
      }}
    >
      {children}
    </div>
  );
}


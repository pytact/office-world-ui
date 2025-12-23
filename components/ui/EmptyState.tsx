// EmptyState Component
// Reusable UI Primitive - R16
// Following R17: Enhanced with action support for flow continuity

"use client";

import React from "react";
import { Button } from "./Button";
import { colors, typography, spacing } from "@/theme/tokens";

interface EmptyStateProps {
  message?: string;
  description?: string;
  actionText?: string;
  onActionClick?: () => void;
}

export function EmptyState({
  message = "No data found",
  description,
  actionText,
  onActionClick,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing[12],
        textAlign: "center",
        gap: spacing[4],
      }}
    >
      <p
        style={{
          color: colors.textPrimary,
          fontSize: typography.fontSize.h3,
          fontWeight: typography.fontWeight.semibold,
          fontFamily: typography.fontFamily,
          marginBottom: description ? spacing[2] : 0,
        }}
      >
        {message}
      </p>
      {description && (
        <p
          style={{
            color: colors.textMuted,
            fontSize: typography.fontSize.body,
            fontWeight: typography.fontWeight.normal,
            fontFamily: typography.fontFamily,
            maxWidth: "500px",
            marginBottom: actionText ? spacing[6] : 0,
          }}
        >
          {description}
        </p>
      )}
      {actionText && onActionClick && (
        <Button onClick={onActionClick} type="button">
          {actionText}
        </Button>
      )}
    </div>
  );
}


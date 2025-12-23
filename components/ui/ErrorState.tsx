// ErrorState Component
// Reusable UI Primitive - R16

"use client";

import React from "react";
import { colors, typography, spacing } from "@/theme/tokens";
import { Button } from "./Button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: spacing[12],
        gap: spacing[4],
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: colors.errorText,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.medium,
          fontFamily: typography.fontFamily,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <Button onClick={onRetry} type="button">
          Retry
        </Button>
      )}
    </div>
  );
}


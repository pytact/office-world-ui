// Loader Component
// Reusable UI Primitive - R16

"use client";

import React from "react";
import { colors, typography } from "@/theme/tokens";

interface LoaderProps {
  message?: string;
}

export function Loader({ message = "Loading..." }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          border: `4px solid ${colors.borderDefault}`,
          borderTopColor: colors.primary,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <p
        style={{
          color: colors.textMuted,
          fontSize: typography.fontSize.body,
          fontWeight: typography.fontWeight.medium,
          fontFamily: typography.fontFamily,
        }}
      >
        {message}
      </p>
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}


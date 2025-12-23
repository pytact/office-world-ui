// Toast Component
// Reusable UI Primitive - R16
// Provides feedback for user actions (success, error, warning, info)

"use client";

import React, { useEffect } from "react";
import { colors, typography, spacing, borderRadius } from "@/theme/tokens";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

const toastStyles = {
  success: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
    borderColor: "#10B981",
  },
  error: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    borderColor: "#EF4444",
  },
  warning: {
    backgroundColor: "#FEF3C7",
    color: "#856404",
    borderColor: "#F59E0B",
  },
  info: {
    backgroundColor: "#DBEAFE",
    color: "#1E40AF",
    borderColor: "#3B82F6",
  },
};

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const style = toastStyles[type];

  return (
    <div
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        border: `1px solid ${style.borderColor}`,
        borderRadius: borderRadius.md,
        padding: spacing[4],
        paddingLeft: spacing[6],
        paddingRight: spacing[6],
        fontSize: typography.fontSize.body,
        fontWeight: typography.fontWeight.medium,
        fontFamily: typography.fontFamily,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        minWidth: "300px",
        maxWidth: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: spacing[4],
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: style.color,
          cursor: "pointer",
          fontSize: "20px",
          lineHeight: "1",
          padding: 0,
          marginLeft: spacing[2],
          opacity: 0.7,
        }}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}


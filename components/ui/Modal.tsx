// Modal Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Modal/Dialog pattern

"use client";

import React, { useEffect } from "react";
import { colors, shadows, borderRadius, spacing, typography } from "@/theme/tokens";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Modal Component
 * Reusable modal/dialog primitive following R16
 * Supports backdrop click to close
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: spacing[4],
      }}
      onClick={onClose}
    >
      <div
        className={className}
        style={{
          backgroundColor: colors.backgroundPrimary,
          borderRadius: borderRadius.md,
          boxShadow: shadows.lg,
          maxWidth: "500px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div
            style={{
              padding: spacing[6],
              borderBottom: `1px solid ${colors.borderDefault}`,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h2
              style={{
                fontSize: typography.fontSize.h3,
                fontFamily: typography.fontFamily,
                fontWeight: typography.fontWeight.medium,
                color: colors.textPrimary,
                margin: 0,
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              type="button"
              style={{
                background: "none",
                border: "none",
                fontSize: typography.fontSize.h4,
                color: colors.textMuted,
                cursor: "pointer",
                padding: spacing[1],
                lineHeight: 1,
              }}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        )}
        <div style={{ padding: spacing[6] }}>{children}</div>
      </div>
    </div>
  );
}


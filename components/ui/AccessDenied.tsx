// Access Denied Component
// F-002: RBAC & Permission Engine
// Error/blocked state component for permission denials
// Following R16 (Reusable Components) and R12 (Figma) rules

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./Button";
import { colors, spacing, typography } from "@/theme/tokens";

interface AccessDeniedProps {
  resource?: string;
  action?: string;
  message?: string;
  redirectTo?: string;
}

export const AccessDenied = React.memo(function AccessDenied({
  resource,
  action,
  message,
  redirectTo = "/",
}: AccessDeniedProps) {
  const defaultMessage = React.useMemo(
    () => message || "You don't have permission to access this resource.",
    [message]
  );

  const containerStyle= React.useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "50vh",
      padding: spacing[6],
      textAlign: "center",
      gap: spacing[4],
    } as const),
    []
  );

  const headingStyle= React.useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.error,
    } as const),
    []
  );

  const messageStyle= React.useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      maxWidth: "500px",
    } as const),
    []
  );

  const detailStyle= React.useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Access Denied</h2>
      <p style={messageStyle}>{defaultMessage}</p>
      {resource && action && (
        <p style={detailStyle}>Required: {resource}:{action}</p>
      )}
      <Link href={redirectTo}>
        <Button type="button">Go to Dashboard</Button>
      </Link>
    </div>
  );
});


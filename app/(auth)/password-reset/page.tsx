// Password Reset Request Page
// Route: /password-reset
// SCR_AUTH_PASSWORD_RESET_REQUEST
// Public route - no authentication required
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/ui";
import { colors, spacing } from "@/theme/tokens";

// Lazy load container component for code splitting
const PasswordResetRequestContainer = dynamic(
  () =>
    import("@/modules/auth/components/PasswordResetRequestContainer").then(
      (mod) => ({ default: mod.PasswordResetRequestContainer })
    ),
  {
    loading: () => <Loader message="Loading password reset form..." />,
    ssr: false,
  }
);

export default function PasswordResetRequestPage() {
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      padding: spacing[6],
      backgroundColor: colors.backgroundSecondary,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <PasswordResetRequestContainer />
    </div>
  );
}


// Password Reset Page
// Route: /reset-password/:token
// SCR_AUTH_PASSWORD_RESET
// Public route - no authentication required
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader } from "@/components/ui";
import { colors, spacing } from "@/theme/tokens";

// Lazy load container component for code splitting
const PasswordResetContainer = dynamic(
  () =>
    import("@/modules/auth/components/PasswordResetContainer").then(
      (mod) => ({ default: mod.PasswordResetContainer })
    ),
  {
    loading: () => <Loader message="Loading password reset form..." />,
    ssr: false,
  }
);

export default function PasswordResetPage() {
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
      <PasswordResetContainer />
    </div>
  );
}


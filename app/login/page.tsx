// Login Page
// Public route - no authentication required
// F-000: Core Platform Foundation - Authentication

"use client";

import React from "react";
import { useAuthContext } from "@/context";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { LoginForm } from "@/modules/auth/components/LoginForm";
import { colors, spacing } from "@/theme/tokens";

export default function LoginPage() {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  // All hooks must be called before any conditional returns
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

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking auth - Modern loading state
  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.backgroundSecondary }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.textMuted }} />
          <p className="text-base font-medium" style={{ color: colors.textMuted }}>Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <LoginForm />
    </div>
  );
}


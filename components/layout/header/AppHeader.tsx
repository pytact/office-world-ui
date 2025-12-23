// App Header Component
// Global header with logout button
// Following R16: Reusable UI component

"use client";

import React, { useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/context";
import { Button } from "@/components/ui/Button";
import { colors, spacing, typography, shadows, borderRadius } from "@/theme/tokens";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      // Error handled by AuthContext
      router.push("/login");
    }
  }, [logout, router]);

  // Check if we should show header (must be after all hooks)
  const shouldShowHeader = pathname !== "/login" && !pathname?.startsWith("/login");

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing[4],
      backgroundColor: colors.backgroundPrimary,
      borderBottom: `1px solid ${colors.borderDefault}`,
      boxShadow: shadows.sm,
      position: "sticky",
      top: 0,
      zIndex: 100,
    } as const),
    []
  );

  const leftSectionStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[4],
    } as const),
    []
  );

  const logoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.bold,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      textDecoration: "none",
      letterSpacing: "-0.02em",
    } as const),
    []
  );

  const userInfoStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[4],
    } as const),
    []
  );

  const userNameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const userRoleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  // Don't render header on login page
  if (!shouldShowHeader) {
    return null;
  }

  return (
    <header style={headerStyle}>
      <div style={leftSectionStyle}>
        <a href="/" style={logoStyle}>
          officeWorld
        </a>
      </div>

      <div style={userInfoStyle}>
        {user && (
          <>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
              <span style={userNameStyle}>
                {user.first_name} {user.last_name}
              </span>
              <span style={userRoleStyle}>{user.role}</span>
            </div>
            <Button
              onClick={() => router.push("/me/profile")}
              type="button"
              variant="secondary"
            >
              Profile
            </Button>
            <Button
              onClick={handleLogout}
              isLoading={isLoading}
              disabled={isLoading}
              type="button"
            >
              Logout
            </Button>
          </>
        )}
      </div>
    </header>
  );
}


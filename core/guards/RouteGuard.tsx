// Route Guard Component
// Centralized route protection following R11 rules

"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";

type Role = "superadmin" | "ceo" | "hr" | "manager" | "employee";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
  requireAuth?: boolean;
}

/**
 * Route Guard Component
 * Protects routes based on authentication and role requirements
 * @param children - Content to render if access is granted
 * @param allowedRoles - Array of roles allowed to access this route
 * @param requireAuth - Whether authentication is required (default: true)
 */
export function RouteGuard({
  children,
  allowedRoles,
  requireAuth = true,
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, user, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push("/login");
      return;
    }

    // Check role requirements
    if (requireAuth && allowedRoles && user) {
      const userRole = user.role.toLowerCase() as Role;
      
      // For superadmin routes, also check is_super_admin flag
      const isSuperAdminRoute = allowedRoles.includes("superadmin");
      const hasSuperAdminAccess = isSuperAdminRoute && (user.is_super_admin === true || userRole === "superadmin");
      
      // Debug logging in development
      if (process.env.NODE_ENV === "development") {
        console.log("[RouteGuard] Role check:", {
          userRole,
          originalRole: user.role,
          allowedRoles,
          isSuperAdminRoute,
          is_super_admin: user.is_super_admin,
          hasSuperAdminAccess,
          matches: hasSuperAdminAccess || allowedRoles.includes(userRole),
        });
      }
      
      // Check access: either role matches OR (superadmin route AND is_super_admin flag is true)
      const hasAccess = hasSuperAdminAccess || allowedRoles.includes(userRole);
      
      if (!hasAccess) {
        if (process.env.NODE_ENV === "development") {
          console.warn("[RouteGuard] Access denied - redirecting to /403");
        }
        router.push("/403");
        return;
      }
    }
  }, [isAuthenticated, user, allowedRoles, requireAuth, isLoading, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base font-medium">Loading...</p>
      </div>
    );
  }

  // Don't render if not authenticated and auth is required
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Don't render if role doesn't match
  if (requireAuth && allowedRoles && user) {
    const userRole = user.role.toLowerCase() as Role;
    
    // For superadmin routes, also check is_super_admin flag
    const isSuperAdminRoute = allowedRoles.includes("superadmin");
    const hasSuperAdminAccess = isSuperAdminRoute && (user.is_super_admin === true || userRole === "superadmin");
    
    // Debug logging in development
    if (process.env.NODE_ENV === "development") {
      console.log("[RouteGuard] Render check:", {
        userRole,
        originalRole: user.role,
        allowedRoles,
        isSuperAdminRoute,
        is_super_admin: user.is_super_admin,
        hasSuperAdminAccess,
        matches: hasSuperAdminAccess || allowedRoles.includes(userRole),
      });
    }
    
    // Check access: either role matches OR (superadmin route AND is_super_admin flag is true)
    const hasAccess = hasSuperAdminAccess || allowedRoles.includes(userRole);
    
    if (!hasAccess) {
      return null;
    }
  }

  return <>{children}</>;
}


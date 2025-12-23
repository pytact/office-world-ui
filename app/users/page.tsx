// Users List Page (Generic)
// Route: /users
// Redirects to appropriate list based on user role

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { useAuthContext } from "@/context";

export default function UsersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    if (user) {
      // Check for SuperAdmin using is_super_admin flag (from API response)
      if (user.is_super_admin) {
        router.replace("/platform/users");
      } else {
        // For company users (CEO, HR, Manager)
        const userRole = user.role.toLowerCase();
        if (["ceo", "hr", "manager"].includes(userRole)) {
          router.replace("/company/users");
        } else {
          // Employee or other roles - redirect to 403
          router.replace("/403");
        }
      }
    }
  }, [user, isAuthenticated, isLoading, router]);

  return (
    <RouteGuard requireAuth={true}>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-base font-medium">Redirecting...</p>
      </div>
    </RouteGuard>
  );
}


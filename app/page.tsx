// Root Page
// Redirects to login if not authenticated, or to appropriate dashboard if authenticated

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, user, isLoading, isSuperAdmin } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // If authenticated, redirect based on role
    if (user) {
      // Check for SuperAdmin using is_super_admin flag (from API response)
      // API spec: is_super_admin boolean field in user object
      if (isSuperAdmin || user.is_super_admin) {
        router.replace("/platform/dashboard");
      } else {
        // For company users (CEO, HR, Manager, Employee)
        const userRole = user.role.toLowerCase();
        if (["ceo", "hr", "manager", "employee"].includes(userRole)) {
          router.replace("/company/dashboard");
        } else {
          // Fallback to users page which handles role-based routing
          router.replace("/users");
        }
      }
    }
  }, [isAuthenticated, user, isLoading, isSuperAdmin, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-base font-medium">Loading...</p>
    </div>
  );
}


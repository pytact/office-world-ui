// Universal Password Change Page
// Route: /me/password
// All roles (SuperAdmin, CEO, HR, Manager, Employee)
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const PasswordChangeContainer = dynamic(
  () =>
    import("@/modules/profile/components/PasswordChangeContainer").then(
      (mod) => ({ default: mod.PasswordChangeContainer })
    ),
  {
    loading: () => <Loader message="Loading password change form..." />,
    ssr: false,
  }
);

export default function PasswordChangePage() {
  // Allow all authenticated roles
  return (
    <RouteGuard allowedRoles={["superadmin", "ceo", "hr", "manager", "employee"]}>
      <PasswordChangeContainer />
    </RouteGuard>
  );
}


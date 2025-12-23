// Universal Profile View Page
// Route: /me/profile
// All roles (SuperAdmin, CEO, HR, Manager, Employee)
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProfileViewContainer = dynamic(
  () =>
    import("@/modules/profile/components/ProfileViewContainer").then(
      (mod) => ({ default: mod.ProfileViewContainer })
    ),
  {
    loading: () => <Loader message="Loading profile..." />,
    ssr: false,
  }
);

export default function ProfilePage() {
  // Allow all authenticated roles
  return (
    <RouteGuard allowedRoles={["superadmin", "ceo", "hr", "manager", "employee"]}>
      <ProfileViewContainer />
    </RouteGuard>
  );
}


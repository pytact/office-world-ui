// Company User Profile Edit Page
// Route: /company/user-profile
// CEO, HR only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProfileEditContainer = dynamic(
  () =>
    import("@/modules/profile/components/ProfileEditContainer").then(
      (mod) => ({ default: mod.ProfileEditContainer })
    ),
  {
    loading: () => <Loader message="Loading profile..." />,
    ssr: false,
  }
);

export default function CompanyUserProfilePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <ProfileEditContainer />
    </RouteGuard>
  );
}


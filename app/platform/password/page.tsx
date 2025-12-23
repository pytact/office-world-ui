// Platform Password Change Page
// Route: /platform/password
// SuperAdmin only
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

export default function PlatformPasswordPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <PasswordChangeContainer />
    </RouteGuard>
  );
}


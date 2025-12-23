// Company Password Change Page
// Route: /company/password
// CEO, HR only
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

export default function CompanyPasswordPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <PasswordChangeContainer />
    </RouteGuard>
  );
}


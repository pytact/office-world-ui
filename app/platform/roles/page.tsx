// Platform Roles List Page
// Route: /platform/roles
// SuperAdmin only
// Shows all available roles in the system

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const RolesListContainer = dynamic(
  () =>
    import("@/modules/users/components/RolesListContainer").then(
      (mod) => ({ default: mod.RolesListContainer })
    ),
  {
    loading: () => <Loader message="Loading roles..." />,
    ssr: false,
  }
);

export default function PlatformRolesPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <RolesListContainer />
    </RouteGuard>
  );
}


// Permissions View Page
// Route: /permissions
// F-002: RBAC & Permission Engine
// Shows current user's permissions (read-only view)
// All authenticated users can view their own permissions
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

const PermissionViewContainer = dynamic(
  () =>
    import("@/modules/permissions/components/PermissionViewContainer").then(
      (mod) => ({ default: mod.PermissionViewContainer })
    ),
  {
    loading: () => <Loader message="Loading permissions..." />,
    ssr: false,
  }
);

export default function PermissionsPage() {
  return (
    <RouteGuard requireAuth={true}>
      <PermissionViewContainer />
    </RouteGuard>
  );
}


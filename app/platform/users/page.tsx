// Platform Users List Page
// Route: /platform/users
// SCR_USER_LIST_PLATFORM
// SuperAdmin only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const UserListPlatformContainer = dynamic(
  () =>
    import("@/modules/users/components/UserListPlatformContainer").then(
      (mod) => ({ default: mod.UserListPlatformContainer })
    ),
  {
    loading: () => <Loader message="Loading users..." />,
    ssr: false,
  }
);

export default function PlatformUsersPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <UserListPlatformContainer />
    </RouteGuard>
  );
}


// Platform User Detail Page
// Route: /platform/users/:id
// SCR_USER_DETAIL
// SuperAdmin only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import { RouteGuard } from "@/core/guards/RouteGuard";
import { UserDetailContainer } from "@/modules/users/components/UserDetailContainer";

export default function PlatformUserDetailPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <UserDetailContainer />
    </RouteGuard>
  );
}

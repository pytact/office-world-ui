// Company User Detail Page
// Route: /company/users/:id
// SCR_USER_DETAIL
// CEO, HR only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const UserDetailContainer = dynamic(
  () =>
    import("@/modules/users/components/UserDetailContainer").then(
      (mod) => ({ default: mod.UserDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading user details..." />,
    ssr: false,
  }
);

export default function CompanyUserDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <UserDetailContainer />
    </RouteGuard>
  );
}


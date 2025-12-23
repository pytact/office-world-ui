// Company User Edit Page
// Route: /company/users/:id/edit
// CEO, HR only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const UserEditContainer = dynamic(
  () =>
    import("@/modules/users/components/UserEditContainer").then(
      (mod) => ({ default: mod.UserEditContainer })
    ),
  {
    loading: () => <Loader message="Loading user edit form..." />,
    ssr: false,
  }
);

export default function CompanyUserEditPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <UserEditContainer />
    </RouteGuard>
  );
}


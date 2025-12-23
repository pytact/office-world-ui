// User Edit Page
// Route: /users/:id/edit
// SCR_USER_EDIT
// SuperAdmin, CEO, HR only
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
    loading: () => <Loader message="Loading edit form..." />,
    ssr: false,
  }
);

export default function UserEditPage() {
  return (
    <RouteGuard allowedRoles={["superadmin", "ceo", "hr"]}>
      <UserEditContainer />
    </RouteGuard>
  );
}


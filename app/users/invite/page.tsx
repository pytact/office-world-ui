// User Invite Page
// Route: /users/invite
// SCR_USER_INVITE
// SuperAdmin, CEO, HR only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const UserInviteContainer = dynamic(
  () =>
    import("@/modules/users/components/UserInviteContainer").then(
      (mod) => ({ default: mod.UserInviteContainer })
    ),
  {
    loading: () => <Loader message="Loading invite form..." />,
    ssr: false,
  }
);

export default function UserInvitePage() {
  return (
    <RouteGuard allowedRoles={["superadmin", "ceo", "hr"]}>
      <UserInviteContainer />
    </RouteGuard>
  );
}


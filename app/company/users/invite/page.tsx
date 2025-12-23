// Company User Invite Page
// Route: /company/users/invite
// SCR_USER_INVITE
// CEO, HR only
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

export default function CompanyUserInvitePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <UserInviteContainer />
    </RouteGuard>
  );
}


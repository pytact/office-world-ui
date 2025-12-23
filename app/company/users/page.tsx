// Company Users List Page
// Route: /company/users
// SCR_USER_LIST_COMPANY
// CEO, HR, Manager only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const UserListCompanyContainer = dynamic(
  () =>
    import("@/modules/users/components/UserListCompanyContainer").then(
      (mod) => ({ default: mod.UserListCompanyContainer })
    ),
  {
    loading: () => <Loader message="Loading users..." />,
    ssr: false,
  }
);

export default function CompanyUsersPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager"]}>
      <UserListCompanyContainer />
    </RouteGuard>
  );
}


// Notifications Inbox Page
// Route: /notifications
// SCR_NOTIFICATION_INBOX
// All authenticated users (company-scoped)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const NotificationInboxContainer = dynamic(
  () =>
    import("@/modules/notifications/containers/NotificationInboxContainer").then(
      (mod) => ({ default: mod.NotificationInboxContainer })
    ),
  {
    loading: () => <Loader message="Loading notifications..." />,
    ssr: false,
  }
);

export default function NotificationsPage() {
  return (
    <RouteGuard
      allowedRoles={["ceo", "hr", "manager", "employee"]}
    >
      <NotificationInboxContainer />
    </RouteGuard>
  );
}


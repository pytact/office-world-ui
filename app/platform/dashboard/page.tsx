// Platform Dashboard Page
// Route: /platform/dashboard
// SuperAdmin only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const PlatformDashboardContainer = dynamic(
  () =>
    import("@/modules/dashboard/components/PlatformDashboardContainer").then(
      (mod) => ({ default: mod.PlatformDashboardContainer })
    ),
  {
    loading: () => <Loader message="Loading dashboard..." />,
    ssr: false,
  }
);

export default function PlatformDashboardPage() {
  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("[PlatformDashboardPage] Rendering platform dashboard");
  }
  
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <PlatformDashboardContainer />
    </RouteGuard>
  );
}

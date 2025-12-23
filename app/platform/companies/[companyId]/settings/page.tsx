// Platform Company Settings Page
// Route: /platform/companies/:companyId/settings
// SuperAdmin only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanySettingsContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanySettingsContainer").then(
      (mod) => ({ default: mod.CompanySettingsContainer })
    ),
  {
    loading: () => <Loader message="Loading company settings..." />,
    ssr: false,
  }
);

export default function PlatformCompanySettingsPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <CompanySettingsContainer />
    </RouteGuard>
  );
}


// Company Settings Page
// Route: /company/settings
// CEO, HR only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanySettingsCEOContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanySettingsCEOContainer").then(
      (mod) => ({ default: mod.CompanySettingsCEOContainer })
    ),
  {
    loading: () => <Loader message="Loading company settings..." />,
    ssr: false,
  }
);

export default function CompanySettingsPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <CompanySettingsCEOContainer />
    </RouteGuard>
  );
}


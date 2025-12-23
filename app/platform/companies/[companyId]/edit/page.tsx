// Platform Company Edit Page
// Route: /platform/companies/:companyId/edit
// SCR_COMPANY_EDIT_PLATFORM
// SuperAdmin only
// Code splitting for performance (R14)

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyEditContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanyEditContainer").then(
      (mod) => ({ default: mod.CompanyEditContainer })
    ),
  {
    loading: () => <Loader message="Loading company edit form..." />,
    ssr: false,
  }
);

export default function PlatformCompanyEditPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <CompanyEditContainer />
    </RouteGuard>
  );
}


// Platform Company Detail Page
// Route: /platform/companies/:companyId
// SCR_COMPANY_DETAIL_PLATFORM
// SuperAdmin only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyDetailPlatformContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanyDetailPlatformContainer").then(
      (mod) => ({ default: mod.CompanyDetailPlatformContainer })
    ),
  {
    loading: () => <Loader message="Loading company details..." />,
    ssr: false,
  }
);

export default function PlatformCompanyDetailPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <CompanyDetailPlatformContainer />
    </RouteGuard>
  );
}


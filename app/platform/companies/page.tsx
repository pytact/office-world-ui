// Platform Companies List Page
// Route: /platform/companies
// SCR_COMPANY_LIST_PLATFORM
// SuperAdmin only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyListPlatformContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanyListPlatformContainer").then(
      (mod) => ({ default: mod.CompanyListPlatformContainer })
    ),
  {
    loading: () => <Loader message="Loading companies..." />,
    ssr: false,
  }
);

export default function PlatformCompaniesPage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <CompanyListPlatformContainer />
    </RouteGuard>
  );
}


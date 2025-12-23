// Platform Company Create Page
// Route: /platform/companies/create
// SCR_COMPANY_CREATE
// SuperAdmin only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyCreateContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanyCreateContainer").then(
      (mod) => ({ default: mod.CompanyCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading create form..." />,
    ssr: false,
  }
);

export default function PlatformCompanyCreatePage() {
  return (
    <RouteGuard allowedRoles={["superadmin"]}>
      <CompanyCreateContainer />
    </RouteGuard>
  );
}


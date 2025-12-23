// Company Profile Page
// Route: /company/profile
// SCR_COMPANY_PROFILE
// CEO/HR only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const CompanyProfileContainer = dynamic(
  () =>
    import("@/modules/companies/components/CompanyProfileContainer").then(
      (mod) => ({ default: mod.CompanyProfileContainer })
    ),
  {
    loading: () => <Loader message="Loading company profile..." />,
    ssr: false,
  }
);

export default function CompanyProfilePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr"]}>
      <CompanyProfileContainer />
    </RouteGuard>
  );
}


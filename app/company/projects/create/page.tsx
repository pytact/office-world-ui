// Company Project Create Page
// Route: /company/projects/create
// SCR_PROJECT_CREATE
// CEO, Manager only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProjectCreateContainer = dynamic(
  () =>
    import("@/modules/projects/components/ProjectCreateContainer").then(
      (mod) => ({ default: mod.ProjectCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading..." />,
    ssr: false,
  }
);

export default function CompanyProjectCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager"]}>
      <ProjectCreateContainer />
    </RouteGuard>
  );
}


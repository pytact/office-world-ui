// Company Project Detail Page
// Route: /company/projects/:id
// SCR_PROJECT_DETAIL
// All roles (CEO, Manager, HR, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProjectDetailContainer = dynamic(
  () =>
    import("@/modules/projects/components/ProjectDetailContainer").then(
      (mod) => ({ default: mod.ProjectDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading project details..." />,
    ssr: false,
  }
);

export default function CompanyProjectDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <ProjectDetailContainer />
    </RouteGuard>
  );
}


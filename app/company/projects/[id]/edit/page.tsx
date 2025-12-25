// Company Project Edit Page
// Route: /company/projects/[id]/edit
// SCR_PROJECT_EDIT
// CEO, Manager only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProjectEditContainer = dynamic(
  () =>
    import("@/modules/projects/components/ProjectEditContainer").then(
      (mod) => ({ default: mod.ProjectEditContainer })
    ),
  {
    loading: () => <Loader message="Loading edit form..." />,
    ssr: false,
  }
);

export default function CompanyProjectEditPage() {
  // Only CEO and Manager can edit projects
  return (
    <RouteGuard allowedRoles={["ceo", "manager"]}>
      <ProjectEditContainer />
    </RouteGuard>
  );
}


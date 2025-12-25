// Company Projects List Page
// Route: /company/projects
// SCR_PROJECT_LIST
// All roles (CEO, Manager, HR, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const ProjectListContainer = dynamic(
  () =>
    import("@/modules/projects/components/ProjectListContainer").then(
      (mod) => ({ default: mod.ProjectListContainer })
    ),
  {
    loading: () => <Loader message="Loading projects..." />,
    ssr: false,
  }
);

export default function CompanyProjectsPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <ProjectListContainer />
    </RouteGuard>
  );
}


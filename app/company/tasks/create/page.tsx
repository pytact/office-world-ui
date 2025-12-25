// Company Task Create Page
// Route: /company/tasks/create
// SCR_TASK_CREATE
// CEO, Manager, Employee only (HR is read-only)
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const TaskCreateContainer = dynamic(
  () =>
    import("@/modules/tasks/components/TaskCreateContainer").then(
      (mod) => ({ default: mod.TaskCreateContainer })
    ),
  {
    loading: () => <Loader message="Loading..." />,
    ssr: false,
  }
);

export default function CompanyTaskCreatePage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "employee"]}>
      <TaskCreateContainer />
    </RouteGuard>
  );
}


// Company Task Detail Page
// Route: /company/tasks/:taskId
// SCR_TASK_DETAIL
// All roles (CEO, Manager, HR, Employee) - visibility differs by role/ownership
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const TaskDetailContainer = dynamic(
  () =>
    import("@/modules/tasks/components/TaskDetailContainer").then(
      (mod) => ({ default: mod.TaskDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading task details..." />,
    ssr: false,
  }
);

export default function CompanyTaskDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <TaskDetailContainer />
    </RouteGuard>
  );
}


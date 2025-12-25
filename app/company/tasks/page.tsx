// Company Tasks List Page
// Route: /company/tasks
// SCR_TASK_LIST
// All roles (CEO, Manager, HR, Employee) - visibility differs by role
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

// Lazy load container component for code splitting
const TaskListContainer = dynamic(
  () =>
    import("@/modules/tasks/components/TaskListContainer").then(
      (mod) => ({ default: mod.TaskListContainer })
    ),
  {
    loading: () => <Loader message="Loading tasks..." />,
    ssr: false,
  }
);

export default function CompanyTasksPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "manager", "hr", "employee"]}>
      <TaskListContainer />
    </RouteGuard>
  );
}


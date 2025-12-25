// Company Task Edit Page
// Route: /company/tasks/[taskId]/edit
// Note: Task editing is done inline in the detail page
// This route redirects to detail page for consistency with R11 4-page structure
// CEO, Manager, Employee (with edit permissions) only
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";

export default function CompanyTaskEditPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.taskId as string;

  useEffect(() => {
    // Redirect to detail page (editing is done inline)
    if (taskId) {
      router.replace(`/company/tasks/${taskId}`);
    }
  }, [taskId, router]);

  return (
    <RouteGuard allowedRoles={["ceo", "manager", "employee"]}>
      <Loader message="Redirecting..." />
    </RouteGuard>
  );
}


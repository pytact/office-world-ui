// Audit Log List Page
// Route: /company/audit-logs
// SCR_AUDIT_LOG_LIST
// CEO, HR, Manager (with restrictions) - Employee and SuperAdmin excluded
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";
import { AuditLogProvider } from "@/context/AuditLogContext";

// Lazy load container component for code splitting
const AuditLogListContainer = dynamic(
  () =>
    import("@/modules/audit/components/AuditLogListContainer").then(
      (mod) => ({ default: mod.AuditLogListContainer })
    ),
  {
    loading: () => <Loader message="Loading audit logs..." />,
    ssr: false,
  }
);

export default function AuditLogListPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager"]}>
      <AuditLogProvider>
        <AuditLogListContainer />
      </AuditLogProvider>
    </RouteGuard>
  );
}


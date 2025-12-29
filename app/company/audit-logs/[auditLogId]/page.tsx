// Audit Log Detail Page
// Route: /company/audit-logs/:auditLogId
// SCR_AUDIT_LOG_DETAIL
// CEO, HR, Manager (with restrictions) - Employee and SuperAdmin excluded
// Code splitting for performance (R14)
// Following R11 rules: Container component only

"use client";

import dynamic from "next/dynamic";
import { RouteGuard } from "@/core/guards/RouteGuard";
import { Loader } from "@/components/ui";
import { AuditLogProvider } from "@/context/AuditLogContext";

// Lazy load container component for code splitting
const AuditLogDetailContainer = dynamic(
  () =>
    import("@/modules/audit/components/AuditLogDetailContainer").then(
      (mod) => ({ default: mod.AuditLogDetailContainer })
    ),
  {
    loading: () => <Loader message="Loading audit log details..." />,
    ssr: false,
  }
);

export default function AuditLogDetailPage() {
  return (
    <RouteGuard allowedRoles={["ceo", "hr", "manager"]}>
      <AuditLogProvider>
        <AuditLogDetailContainer />
      </AuditLogProvider>
    </RouteGuard>
  );
}


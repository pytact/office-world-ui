// Context Exports
// Central export for all context providers and hooks
// Following R6 rules: All context consumed via custom hooks

export { AuthProvider, useAuthContext } from "./AuthContext";
export type { AuthUser } from "./AuthContext";

export { PermissionProvider, usePermissionContext } from "./PermissionContext";

export { NotificationProvider, useNotificationContext } from "./NotificationContext";

export { CompanyProvider, useCompanyContext } from "./CompanyContext";

export { ProjectProvider, useProjectContext } from "./ProjectContext";

export { TaskProvider, useTaskContext } from "./TaskContext";

// Re-export useAuth hook for convenience (wraps useAuthContext)
// Components should use useAuth() instead of useAuthContext() directly
export { useAuth } from "@/hooks/useAuth";

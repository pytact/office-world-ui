// Permission Gate Component
// F-002: RBAC & Permission Engine
// Action-level enforcement component
// Following R16 (Reusable Components) and R7 (Hooks/Context) rules

"use client";

import React from "react";
import { usePermissionContext } from "@/context";

interface PermissionGateProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
  mode?: "hide" | "disable";
}

export const PermissionGate = React.memo(function PermissionGate({
  children,
  resource,
  action,
  fallback = null,
  mode = "hide",
}: PermissionGateProps) {
  const { canAccess, isLoading } = usePermissionContext();

  if (isLoading) {
    return null;
  }

  const hasAccess = canAccess(resource, action);

  if (!hasAccess) {
    if (mode === "disable" && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...children.props,
        disabled: true,
        "aria-disabled": true,
      } as React.HTMLAttributes<HTMLElement>);
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
});


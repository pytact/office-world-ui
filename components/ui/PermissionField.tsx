// Permission Field Component
// F-002: RBAC & Permission Engine
// Data-level restrictions component
// Following R16 (Reusable Components) and R7 (Hooks/Context) rules

"use client";

import React from "react";
import { usePermissionContext } from "@/context";

interface PermissionFieldProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  fallback?: React.ReactNode;
}

export const PermissionField = React.memo(function PermissionField({
  children,
  resource,
  action,
  fallback = <span>***</span>,
}: PermissionFieldProps) {
  const { canAccess, isLoading } = usePermissionContext();

  if (isLoading) {
    return <>{fallback}</>;
  }

  if (!canAccess(resource, action)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
});


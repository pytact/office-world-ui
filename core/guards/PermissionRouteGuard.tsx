// Permission Route Guard Component
// F-002: RBAC & Permission Engine
// Permission-based route protection
// Following R11 (Routing) and R7 (Hooks/Context) rules

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { usePermissionContext } from "@/context";
import { Loader } from "@/components/ui/Loader";
import { AccessDenied } from "@/components/ui/AccessDenied";

interface PermissionRouteGuardProps {
  children: React.ReactNode;
  resource: string;
  action: string;
  redirectTo?: string;
}

export function PermissionRouteGuard({
  children,
  resource,
  action,
  redirectTo,
}: PermissionRouteGuardProps) {
  const router = useRouter();
  const { canAccess, isLoading } = usePermissionContext();

  const hasAccess = React.useMemo(
    () => canAccess(resource, action),
    [canAccess, resource, action]
  );

  const handleRedirect = React.useCallback(() => {
    if (redirectTo) {
      router.push(redirectTo);
    }
  }, [redirectTo, router]);

  React.useEffect(() => {
    if (isLoading) return;

    if (!hasAccess) {
      handleRedirect();
    }
  }, [hasAccess, isLoading, handleRedirect]);

  if (isLoading) {
    return <Loader />;
  }

  if (!hasAccess) {
    if (redirectTo) {
      return null;
    }
    return <AccessDenied resource={resource} action={action} />;
  }

  return <>{children}</>;
}


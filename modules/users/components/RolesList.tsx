// Roles List UI Component
// Pure UI component for displaying roles list
// Following R7: Pure UI component

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Card, Badge } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import { RoleResponse } from "@/utils/types/responses/user";

interface RolesListProps {
  roles: RoleResponse[];
}

export const RolesList = React.memo(function RolesList({ roles }: RolesListProps) {
  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const titleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const subtitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: spacing[6],
    } as const),
    []
  );

  const roleCodeStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const roleNameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const getRoleBadgeVariant = (code: string): "success" | "warning" | "error" | "default" => {
    switch (code.toLowerCase()) {
      case "superadmin":
        return "error";
      case "ceo":
        return "warning";
      case "hr":
        return "success";
      default:
        return "default";
    }
  };

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[4],
      display: "inline-block",
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: spacing[4] }}>
        <Link href="/platform/dashboard" style={backLinkStyle}>
          ← Back to Dashboard
        </Link>
      </div>
      <div style={headerStyle}>
        <h1 style={titleStyle}>System Roles</h1>
        <p style={subtitleStyle}>
          View all available roles in the platform ({roles.length} roles)
        </p>
      </div>

      <div style={gridStyle}>
        {roles.map((role) => (
          <Card key={role.code}>
            <div style={roleCodeStyle}>{role.code}</div>
            <div style={roleNameStyle}>{role.name}</div>
            <Badge variant={getRoleBadgeVariant(role.code)}>
              {role.code}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
});


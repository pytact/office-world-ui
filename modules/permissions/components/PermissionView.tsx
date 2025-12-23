// Permission View Component
// F-002: RBAC & Permission Engine
// Pure UI component following R7 and R16 rules

"use client";

import React from "react";
import { Card } from "@/components/ui";
import { colors, spacing, typography, borderRadius } from "@/theme/tokens";
import type {
  PermissionSet,
  AuthContextResponse,
} from "@/utils/types/responses/permission";

interface PermissionViewProps {
  permissions: PermissionSet;
  context: AuthContextResponse | null;
}

export const PermissionView = React.memo(function PermissionView({
  permissions,
  context,
}: PermissionViewProps) {
  const containerStyle= {
    padding: `${spacing[8]} ${spacing[6]}`,
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headingStyle= {
    fontSize: typography.fontSize.h1,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing[8],
  };

  const cardHeadingStyle= {
    fontSize: typography.fontSize.h4,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textPrimary,
    marginBottom: spacing[6],
    paddingBottom: spacing[3],
    borderBottom: `2px solid ${colors.borderLight}`,
  };

  const gridStyle= {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: spacing[4],
  };

  const labelStyle= {
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
    color: colors.textMuted,
    marginBottom: spacing[1],
    display: "block",
  };

  const textStyle= {
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    margin: 0,
  };

  const badgeStyle= {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
    backgroundColor: colors.success,
    color: colors.textInverse,
    marginRight: spacing[1],
    marginBottom: spacing[1],
  };

  const permissionListStyle= {
    display: "flex",
    flexWrap: "wrap",
    gap: spacing[2],
    marginTop: spacing[2],
  };

  const permissionItemStyle= {
    display: "inline-block",
    padding: `${spacing[1]} ${spacing[2]}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.small,
    fontFamily: typography.fontFamily,
    backgroundColor: colors.backgroundSecondary,
    color: colors.textPrimary,
    border: `1px solid ${colors.borderDefault}`,
  };

  const emptyStateStyle= {
    textAlign: "center",
    padding: spacing[8],
    color: colors.textMuted,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily,
  };

  const cardsContainerStyle= {
    display: "flex",
    flexDirection: "column",
    gap: spacing[6],
  };

  const permissionsSectionStyle= {
    marginTop: spacing[6],
  };

  const permissionItemContainerStyle= {
    marginBottom: spacing[4],
  };

  const permissionCount = React.useMemo(
    () => Object.keys(permissions).length,
    [permissions]
  );

  const totalActions = React.useMemo(
    () =>
      Object.values(permissions).reduce(
        (sum, actions) => sum + actions.length,
        0
      ),
    [permissions]
  );

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>My Permissions</h1>

      <div style={cardsContainerStyle}>
        <Card>
          <h2 style={cardHeadingStyle}>Context Information</h2>
          {context && (
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>User ID</label>
                <p style={textStyle}>{context.user_id}</p>
              </div>
              <div>
                <label style={labelStyle}>Role</label>
                <p style={textStyle}>{context.role.name}</p>
              </div>
              <div>
                <label style={labelStyle}>Role Code</label>
                <p style={textStyle}>{context.role.code}</p>
              </div>
              <div>
                <label style={labelStyle}>Company</label>
                <p style={textStyle}>
                  {context.company?.slug || "N/A (SuperAdmin)"}
                </p>
              </div>
              <div>
                <label style={labelStyle}>Super Admin</label>
                <span style={badgeStyle}>
                  {context.is_super_admin ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <label style={labelStyle}>User Active</label>
                <span style={badgeStyle}>
                  {context.is_user_active ? "Yes" : "No"}
                </span>
              </div>
              <div>
                <label style={labelStyle}>Company Active</label>
                <span style={badgeStyle}>
                  {context.is_company_active === null
                    ? "N/A"
                    : context.is_company_active
                      ? "Yes"
                      : "No"}
                </span>
              </div>
            </div>
          )}
        </Card>

        <Card>
          <h2 style={cardHeadingStyle}>Permissions</h2>
          {permissionCount === 0 ? (
            <div style={emptyStateStyle}>
              No permissions available. Your account may be deactivated or your
              company may be inactive.
            </div>
          ) : (
            <>
              <div style={gridStyle}>
                <div>
                  <label style={labelStyle}>Total Resources</label>
                  <p style={textStyle}>{permissionCount}</p>
                </div>
                <div>
                  <label style={labelStyle}>Total Actions</label>
                  <p style={textStyle}>{totalActions}</p>
                </div>
              </div>

              <div style={permissionsSectionStyle}>
                {Object.entries(permissions).map(([resource, actions]) => (
                  <div
                    key={resource}
                    style={permissionItemContainerStyle}
                  >
                    <label style={labelStyle}>{resource}</label>
                    <div style={permissionListStyle}>
                      {actions.map((action) => (
                        <span key={action} style={permissionItemStyle}>
                          {action}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
});


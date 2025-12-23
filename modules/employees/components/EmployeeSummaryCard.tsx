// Employee Summary Card Component
// Feature-specific component - R16 Layer 2
// Displays key employee information at top of detail screen

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedEmployeeDetail } from "@/hooks/useEmployeeTransformations";

interface EmployeeSummaryCardProps {
  employee: TransformedEmployeeDetail;
}

export const EmployeeSummaryCard = React.memo(function EmployeeSummaryCard({
  employee,
}: EmployeeSummaryCardProps) {
  // Memoized style objects
  const cardContentStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[4],
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
    } as const),
    []
  );

  const nameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h2,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const emailStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const infoGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: spacing[4],
    } as const),
    []
  );

  const infoItemStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[1],
    } as const),
    []
  );

  const infoLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
    } as const),
    []
  );

  const infoValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  return (
    <Card padding="lg">
      <div style={cardContentStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={nameStyle}>{employee.user.full_name}</h2>
            <p style={emailStyle}>{employee.user.email}</p>
          </div>
          <Badge variant={employee.is_active ? "success" : "default"}>
            {employee.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div style={infoGridStyle}>
          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Employee ID</span>
            <span style={infoValueStyle}>{employee.employee_id}</span>
          </div>

          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Job Title</span>
            <span style={infoValueStyle}>{employee.job_title || "—"}</span>
          </div>

          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Department</span>
            <span style={infoValueStyle}>
              {employee.departmentLabel || "—"}
            </span>
          </div>

          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Employment Status</span>
            <span style={infoValueStyle}>
              {employee.employmentStatusLabel}
            </span>
          </div>

          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Joining Date</span>
            <span style={infoValueStyle}>
              {employee.joiningDateFormatted}
            </span>
          </div>

          <div style={infoItemStyle}>
            <span style={infoLabelStyle}>Work Email</span>
            <span style={infoValueStyle}>
              {employee.work_email || "—"}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
});


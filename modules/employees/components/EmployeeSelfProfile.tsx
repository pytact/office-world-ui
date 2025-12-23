// Employee Self Profile UI Component
// SCR_EMPLOYEE_SELF_PROFILE - Pure UI component following R7
// Read-only view of own employee profile
// Enhanced with modern UX: clear hierarchy, improved spacing, visual grouping

"use client";

import React, { useMemo } from "react";
import { Card, Badge } from "@/components/ui";
import { EmployeeSummaryCard } from "./EmployeeSummaryCard";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedEmployeeDetail } from "@/hooks/useEmployeeTransformations";

interface EmployeeSelfProfileProps {
  employee: TransformedEmployeeDetail;
}

export const EmployeeSelfProfile = React.memo(function EmployeeSelfProfile({
  employee,
}: EmployeeSelfProfileProps) {
  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const sectionStyle = useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[6],
      paddingBottom: spacing[3],
      borderBottom: `2px solid ${colors.borderLight}`,
    } as const),
    []
  );

  // Modern field grid layout - replaces old table-like rows
  const fieldGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: spacing[5],
      rowGap: spacing[6],
    } as const),
    []
  );

  const fieldItemStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "4px",
    } as const),
    []
  );

  const fieldLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    } as const),
    []
  );

  const fieldValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <EmployeeSummaryCard employee={employee} />

      {/* Professional Information Section */}
      <div style={sectionStyle}>
        <Card padding="lg" variant="default">
          <h2 style={sectionTitleStyle}>Professional Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Job Title</span>
              <span style={fieldValueStyle}>{(employee as any).job_title || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Department</span>
              <span style={fieldValueStyle}>
                {employee.departmentLabel || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Employment Type</span>
              <span style={fieldValueStyle}>
                {employee.employmentTypeLabel || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Employment Level</span>
              <span style={fieldValueStyle}>
                {employee.employmentLevelLabel || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Work Email</span>
              <span style={fieldValueStyle}>{(employee as any).work_email || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Employment Status</span>
              <span style={fieldValueStyle}>
                {employee.employmentStatusLabel}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Joining Date</span>
              <span style={fieldValueStyle}>
                {employee.joiningDateFormatted}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Personal Information Section */}
      <div style={sectionStyle}>
        <Card padding="lg" variant="default">
          <h2 style={sectionTitleStyle}>Personal Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Gender</span>
              <span style={fieldValueStyle}>{employee.genderLabel || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Marital Status</span>
              <span style={fieldValueStyle}>
                {employee.maritalStatusLabel || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Blood Group</span>
              <span style={fieldValueStyle}>
                {(employee as any).blood_group || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Nationality</span>
              <span style={fieldValueStyle}>
                {(employee as any).nationality || "—"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Location Information Section */}
      <div style={sectionStyle}>
        <Card padding="lg" variant="default">
          <h2 style={sectionTitleStyle}>Location Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Address</span>
              <span style={fieldValueStyle}>{(employee as any).address || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>City</span>
              <span style={fieldValueStyle}>{(employee as any).city || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>State</span>
              <span style={fieldValueStyle}>{(employee as any).state || "—"}</span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Country</span>
              <span style={fieldValueStyle}>{(employee as any).country || "—"}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});


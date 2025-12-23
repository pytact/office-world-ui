// Employee Detail UI Component
// SCR_EMPLOYEE_DETAIL - Pure UI component following R7
// Composes UI primitives following R16
// View mode only (edit mode can be added later)

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Button, Card, Badge } from "@/components/ui";
import { EmployeeSummaryCard } from "./EmployeeSummaryCard";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedEmployeeDetail } from "@/hooks/useEmployeeTransformations";

interface EmployeeDetailProps {
  employee: TransformedEmployeeDetail;
  canEdit: boolean;
  canDeactivate: boolean;
  canSoftDelete: boolean;
  isActive: boolean;
  onEdit?: () => void;
  onDeactivate?: () => void;
  onReactivate?: () => void;
  onDelete?: () => void;
  isDeactivating?: boolean;
  isDeleting?: boolean;
}

export const EmployeeDetail = React.memo(function EmployeeDetail({
  employee,
  canEdit,
  canDeactivate,
  canSoftDelete,
  isActive,
  onEdit,
  onDeactivate,
  onReactivate,
  onDelete,
  isDeactivating = false,
  isDeleting = false,
}: EmployeeDetailProps) {
  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
      marginBottom: spacing[6],
      display: "inline-block",
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

  const actionsContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      marginTop: spacing[6],
      paddingTop: spacing[6],
      borderTop: `2px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <Link href={employeeRoutes.company.list} style={backLinkStyle}>
        ← Back to Employees
      </Link>

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

      {/* Document Information Section */}
      <div style={sectionStyle}>
        <Card padding="lg" variant="default">
          <h2 style={sectionTitleStyle}>Document Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Document Type</span>
              <span style={fieldValueStyle}>
                {employee.documentTypeLabel || "—"}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Document Number</span>
              <span style={fieldValueStyle}>
                {(employee as any).document_number || "—"}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Separation Information Section (Conditional) */}
      {employee.showSeparationFields && (
        <div style={sectionStyle}>
          <Card padding="lg" variant="default">
            <h2 style={sectionTitleStyle}>Separation Information</h2>

            <div style={fieldGridStyle}>
              <div style={fieldItemStyle}>
                <span style={fieldLabelStyle}>Separation Initiated Date</span>
                <span style={fieldValueStyle}>
                  {employee.separationInitiatedDateFormatted || "—"}
                </span>
              </div>

              <div style={fieldItemStyle}>
                <span style={fieldLabelStyle}>Last Working Day</span>
                <span style={fieldValueStyle}>
                  {employee.lastWorkingDayFormatted || "—"}
                </span>
              </div>

              <div style={fieldItemStyle}>
                <span style={fieldLabelStyle}>Separation Reason</span>
                <span style={fieldValueStyle}>
                  {(employee as any).separation_reason || "—"}
                </span>
              </div>

              <div style={fieldItemStyle}>
                <span style={fieldLabelStyle}>Notice Period (Days)</span>
                <span style={fieldValueStyle}>
                  {(employee as any).notice_period_days ?? "—"}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Audit Information Section */}
      <div style={sectionStyle}>
        <Card padding="lg" variant="default">
          <h2 style={sectionTitleStyle}>Audit Information</h2>

          <div style={fieldGridStyle}>
            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Created At</span>
              <span style={fieldValueStyle}>
                {employee.createdAtFormatted}
              </span>
            </div>

            <div style={fieldItemStyle}>
              <span style={fieldLabelStyle}>Updated At</span>
              <span style={fieldValueStyle}>
                {employee.updatedAtFormatted}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Lifecycle Actions */}
      {(canEdit || canDeactivate || canSoftDelete) && (
        <div style={actionsContainerStyle}>
          {canEdit && (
            <Button type="button" onClick={onEdit}>
              Edit Employee
            </Button>
          )}
          {canDeactivate && (
            <>
              {isActive ? (
                <Button
                  type="button"
                  onClick={onDeactivate}
                  isLoading={isDeactivating}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onReactivate}
                  isLoading={isDeactivating}
                >
                  Reactivate
                </Button>
              )}
            </>
          )}
          {canSoftDelete && (
            <Button
              type="button"
              onClick={onDelete}
              isLoading={isDeleting}
            >
              Delete Employee
            </Button>
          )}
        </div>
      )}
    </div>
  );
});


// Task Assignment List Component
// Feature-specific component - R16 Layer 2
// Displays list of task assignees with permissions

"use client";

import React, { useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TaskAssignment } from "@/utils/types/responses/task";
import { getPermissionLabel } from "@/hooks/useTaskTransformations";
import { useEmployeeNames } from "@/hooks/useEmployeeNames";

interface TaskAssignmentListProps {
  assignments: TaskAssignment[];
  canManage: boolean;
  onManage?: () => void;
}

/**
 * Task Assignment List Component
 * Displays list of assignees with their permissions
 * Following R17: Secondary content area
 */
export const TaskAssignmentList = React.memo(function TaskAssignmentList({
  assignments,
  canManage,
  onManage,
}: TaskAssignmentListProps) {
  // Extract employee IDs from assignments
  const employeeIds = useMemo(
    () => assignments.map((a) => a.employee_id),
    [assignments]
  );

  // Fetch employee names
  const { employeeNames, isLoading: isLoadingNames } = useEmployeeNames({
    employeeIds,
    enabled: employeeIds.length > 0,
  });
  const containerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[4],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      margin: 0,
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const listStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
    } as const),
    []
  );

  const itemStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "8px",
    } as const),
    []
  );

  const textStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  const emptyStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
      fontStyle: "italic" as const,
      padding: spacing[4],
    } as const),
    []
  );

  const manageButtonStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      background: "none",
      border: "none",
      cursor: "pointer",
      textDecoration: "underline",
    } as const),
    []
  );

  return (
    <Card variant="default" padding="lg">
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={sectionTitleStyle}>Assignments</h2>
          {canManage && onManage && (
            <button
              type="button"
              onClick={onManage}
              style={manageButtonStyle}
            >
              Manage
            </button>
          )}
        </div>
        {assignments.length > 0 ? (
          <div style={listStyle}>
            {assignments.map((assignment) => {
              // Get employee name, fallback to ID if name not available
              const employeeName =
                employeeNames[assignment.employee_id] ||
                (isLoadingNames ? "Loading..." : assignment.employee_id);

              return (
                <div key={assignment.employee_id} style={itemStyle}>
                  <span style={textStyle}>
                    {employeeName}
                    {!employeeNames[assignment.employee_id] && !isLoadingNames && (
                      <span style={{ fontSize: typography.fontSize.small, color: colors.textMuted, marginLeft: spacing[2] }}>
                        ({assignment.employee_id.slice(0, 8)}...)
                      </span>
                    )}
                  </span>
                  <Badge variant={assignment.permission === "EDITOR" ? "info" : "default"}>
                    {getPermissionLabel(assignment.permission)}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={emptyStyle}>No assignments yet</div>
        )}
      </div>
    </Card>
  );
});


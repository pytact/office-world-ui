// Task Assignment Modal Component
// Feature-specific component - R16 Layer 2
// Modal for managing task assignments

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button, Input, Select } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TaskAssignmentAdd, TaskAssignmentRemove } from "@/utils/types/requests/task";
import { useEmployeeNames } from "@/hooks/useEmployeeNames";
import { useListEmployees } from "@/hooks/useEmployees";
import { useToast } from "@/context/ToastContext";

interface TaskAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (add: TaskAssignmentAdd[], remove: TaskAssignmentRemove[]) => void;
  existingAssignments: Array<{ employee_id: string; permission: "VIEWER" | "EDITOR" }>;
  isLoading?: boolean;
}

/**
 * Task Assignment Modal
 * Manages task assignments (add/remove assignees with permissions)
 * Following R17: Clear assignment flow
 * Following R14: Memoized for performance
 */
export const TaskAssignmentModal = React.memo(function TaskAssignmentModal({
  isOpen,
  onClose,
  onSave,
  existingAssignments,
  isLoading = false,
}: TaskAssignmentModalProps) {
  const { showError } = useToast();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [selectedPermission, setSelectedPermission] = useState<"VIEWER" | "EDITOR">("VIEWER");
  const [assignmentsToAdd, setAssignmentsToAdd] = useState<TaskAssignmentAdd[]>([]);
  const [assignmentsToRemove, setAssignmentsToRemove] = useState<string[]>([]);

  // Fetch list of employees for selection
  const employeesQuery = useListEmployees({
    page_size: 20, // Default page size
  });

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setSelectedEmployeeId("");
      setSelectedPermission("VIEWER");
      setAssignmentsToAdd([]);
      setAssignmentsToRemove([]);
    }
  }, [isOpen]);

  // Get all employee IDs (existing + pending additions) for name lookup
  const allEmployeeIds = useMemo(() => {
    const existingIds = existingAssignments.map((a) => a.employee_id);
    const pendingIds = assignmentsToAdd.map((a) => a.employee_id);
    return [...new Set([...existingIds, ...pendingIds])];
  }, [existingAssignments, assignmentsToAdd]);

  // Fetch employee names for display
  const { employeeNames, isLoading: isLoadingNames } = useEmployeeNames({
    employeeIds: allEmployeeIds,
    enabled: isOpen && allEmployeeIds.length > 0, // Only fetch when modal is open
  });

  const handleAddAssignment = useCallback(() => {
    if (!selectedEmployeeId) {
      showError("Please select an employee");
      return;
    }
    
    // Check if already assigned in existing assignments
    const isAlreadyAssigned = existingAssignments.some(
      (a) => a.employee_id === selectedEmployeeId
    );
    
    // Check if already in pending additions
    const isPendingAdd = assignmentsToAdd.some(
      (a) => a.employee_id === selectedEmployeeId
    );
    
    if (isAlreadyAssigned || isPendingAdd) {
      showError("This employee is already assigned or pending assignment");
      return;
    }

    // Add to pending assignments
    setAssignmentsToAdd((prev) => [
      ...prev,
      {
        employee_id: selectedEmployeeId,
        permission: selectedPermission,
      },
    ]);

    // Reset selection
    setSelectedEmployeeId("");
    setSelectedPermission("VIEWER");
  }, [selectedEmployeeId, selectedPermission, existingAssignments, assignmentsToAdd, showError]);

  const handleRemoveAssignment = useCallback((employeeId: string) => {
    // Remove from pending additions if exists
    setAssignmentsToAdd((prev) => prev.filter((a) => a.employee_id !== employeeId));
    // Add to removals
    setAssignmentsToRemove((prev) => {
      if (prev.includes(employeeId)) return prev;
      return [...prev, employeeId];
    });
  }, []);

  const handleSave = useCallback(() => {
    // Check if there are any changes
    if (assignmentsToAdd.length === 0 && assignmentsToRemove.length === 0) {
      showError("No changes to save");
      return;
    }

    const add: TaskAssignmentAdd[] = assignmentsToAdd;
    const remove: TaskAssignmentRemove[] = assignmentsToRemove.map((id) => ({
      employee_id: id,
    }));

    onSave(add, remove);
  }, [assignmentsToAdd, assignmentsToRemove, onSave, showError]);

  // Get available employees (excluding already assigned and pending additions)
  const availableEmployeeOptions = useMemo(() => {
    if (!employeesQuery.data?.data?.items) return [];

    const assignedIds = new Set([
      ...existingAssignments.map((a) => a.employee_id),
      ...assignmentsToAdd.map((a) => a.employee_id),
    ]);

    return employeesQuery.data.data.items
      .filter((emp) => !assignedIds.has(emp.employee_id))
      .map((emp) => {
        const name = emp.user?.first_name && emp.user?.last_name
          ? `${emp.user.first_name} ${emp.user.last_name}`
          : emp.user?.email || emp.employee_id;
        return {
          value: emp.employee_id,
          label: name,
        };
      });
  }, [employeesQuery.data?.data?.items, existingAssignments, assignmentsToAdd]);

  // Display assignments (existing + pending additions, excluding removals)
  const displayAssignments = useMemo(() => {
    const existing = existingAssignments
      .filter((a) => !assignmentsToRemove.includes(a.employee_id))
      .map((a) => ({ ...a, isPending: false }));

    const pending = assignmentsToAdd.map((a) => ({
      employee_id: a.employee_id,
      permission: a.permission,
      isPending: true,
    }));

    return [...existing, ...pending];
  }, [existingAssignments, assignmentsToRemove, assignmentsToAdd]);

  const messageStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      marginBottom: spacing[6],
    } as const),
    []
  );

  const listStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[3],
      marginBottom: spacing[6],
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

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      justifyContent: "flex-end" as const,
      marginTop: spacing[6],
    } as const),
    []
  );

  const sectionTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      marginBottom: spacing[4],
      margin: 0,
    } as const),
    []
  );

  const assignmentItemStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
      alignItems: "center" as const,
    } as const),
    []
  );

  const emptyTextStyle = useMemo(
    () => ({
      color: colors.textMuted,
      fontStyle: "italic" as const,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  const noteTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const handleRemoveClick = useCallback(
    (employeeId: string) => {
      handleRemoveAssignment(employeeId);
    },
    [handleRemoveAssignment]
  );

  // Memoized styles for assignment items
  const employeeIdStyle = useMemo(
    () => ({
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      fontSize: typography.fontSize.body,
    } as const),
    []
  );

  const permissionTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  // Memoized assignment item component (R14: avoid inline functions in map)
  const AssignmentItem = React.memo(function AssignmentItem({
    assignment,
    onRemove,
    employeeName,
    isLoadingName,
    isPending = false,
    itemStyle: itemStyleProp,
    employeeIdStyle: employeeIdStyleProp,
    assignmentItemStyle: assignmentItemStyleProp,
    permissionTextStyle: permissionTextStyleProp,
  }: {
    assignment: { employee_id: string; permission: "VIEWER" | "EDITOR" };
    onRemove: (employeeId: string) => void;
    employeeName: string | null;
    isLoadingName: boolean;
    isPending?: boolean;
    itemStyle: React.CSSProperties;
    employeeIdStyle: React.CSSProperties;
    assignmentItemStyle: React.CSSProperties;
    permissionTextStyle: React.CSSProperties;
  }) {
    const handleRemove = useCallback(() => {
      onRemove(assignment.employee_id);
    }, [assignment.employee_id, onRemove]);

    const displayName = employeeName || (isLoadingName ? "Loading..." : assignment.employee_id);

    return (
      <div style={itemStyleProp}>
        <span style={employeeIdStyleProp}>
          {displayName}
          {!employeeName && !isLoadingName && (
            <span style={{ fontSize: typography.fontSize.small, color: colors.textMuted, marginLeft: spacing[2] }}>
              ({assignment.employee_id.slice(0, 8)}...)
            </span>
          )}
          {isPending && (
            <span style={{ fontSize: typography.fontSize.small, color: colors.primary, marginLeft: spacing[2], fontStyle: "italic" }}>
              (Pending)
            </span>
          )}
        </span>
        <div style={assignmentItemStyleProp}>
          <span style={permissionTextStyleProp}>
            {assignment.permission}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleRemove}
          >
            Remove
          </Button>
        </div>
      </div>
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Assignments">
      <div>
        <p style={messageStyle}>
          Manage who has access to this task and their permission level.
        </p>

        {/* Add New Assignment Section */}
        <div style={{ marginBottom: spacing[6] }}>
          <h3 style={sectionTitleStyle}>
            Add Assignment
          </h3>
          <div style={{ display: "flex", gap: spacing[3], alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px", minWidth: "200px" }}>
              <label
                htmlFor="employee-select"
                style={{
                  fontSize: typography.fontSize.small,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily,
                  color: colors.textPrimary,
                  marginBottom: spacing[2],
                  display: "block",
                }}
              >
                Employee
              </label>
              <Select
                id="employee-select"
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                options={[
                  { value: "", label: "Select an employee..." },
                  ...availableEmployeeOptions,
                ]}
                disabled={employeesQuery.isLoading || isLoading}
              />
            </div>
            <div style={{ flex: "1 1 150px", minWidth: "150px" }}>
              <label
                htmlFor="permission-select"
                style={{
                  fontSize: typography.fontSize.small,
                  fontWeight: typography.fontWeight.medium,
                  fontFamily: typography.fontFamily,
                  color: colors.textPrimary,
                  marginBottom: spacing[2],
                  display: "block",
                }}
              >
                Permission
              </label>
              <Select
                id="permission-select"
                value={selectedPermission}
                onChange={(e) => setSelectedPermission(e.target.value as "VIEWER" | "EDITOR")}
                options={[
                  { value: "VIEWER", label: "Viewer" },
                  { value: "EDITOR", label: "Editor" },
                ]}
                disabled={isLoading}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={handleAddAssignment}
              disabled={!selectedEmployeeId || isLoading || employeesQuery.isLoading}
            >
              Add
            </Button>
          </div>
          {employeesQuery.isLoading && (
            <p style={{ ...noteTextStyle, marginTop: spacing[2] }}>
              Loading employees...
            </p>
          )}
        </div>

        {/* Current Assignments */}
        <div>
          <h3 style={sectionTitleStyle}>
            Current Assignments
          </h3>
          {displayAssignments.length > 0 ? (
            <div style={listStyle}>
              {displayAssignments.map((assignment) => (
                <AssignmentItem
                  key={`${assignment.employee_id}-${assignment.isPending ? "pending" : "existing"}`}
                  assignment={assignment}
                  onRemove={handleRemoveClick}
                  employeeName={employeeNames[assignment.employee_id] || null}
                  isLoadingName={isLoadingNames}
                  isPending={assignment.isPending}
                  itemStyle={itemStyle}
                  employeeIdStyle={employeeIdStyle}
                  assignmentItemStyle={assignmentItemStyle}
                  permissionTextStyle={permissionTextStyle}
                />
              ))}
            </div>
          ) : (
            <p style={emptyTextStyle}>
              No assignments
            </p>
          )}
        </div>


        <div style={buttonGroupStyle}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            isLoading={isLoading}
            disabled={isLoading || (assignmentsToAdd.length === 0 && assignmentsToRemove.length === 0)}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
});


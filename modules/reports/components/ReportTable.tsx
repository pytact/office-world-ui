// Report Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for report data display
// Following R17: Primary visual element, clear hierarchy

"use client";

import React, { useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ReportMetadata } from "@/utils/types/responses/report";
import { colors, spacing, typography } from "@/theme/tokens";

interface ReportTableProps {
  rows: unknown[];
  metadata: ReportMetadata | null;
  reportType?: string;
  onExportRow?: (rowData: Record<string, unknown>) => void;
  canExport?: boolean;
}

/**
 * Report Table Component
 * Table display for report data
 * Following R17: Primary visual element, clear hierarchy
 * 
 * Note: Report rows are dynamic and vary by report type
 * This component filters out internal formatted fields and shows only user-friendly columns
 */
export const ReportTable = React.memo(function ReportTable({
  rows,
  metadata,
  reportType,
  onExportRow,
  canExport = false,
}: ReportTableProps) {
  // Fields to exclude from display (internal formatted fields only)
  // We keep the original fields but use formatted versions for display
  const excludedFields = useMemo(
    () => [
      // Internal formatted fields (we'll use these for display but not show the field itself)
      "dateFormatted",
      "startDateFormatted",
      "endDateFormatted",
      "dueDateFormatted",
      "hireDateFormatted",
      "timestampFormatted",
      "checkInTimeFormatted",
      "checkOutTimeFormatted",
      "appliedDateFormatted",
      "statusLabel",
      "statusBadgeColor",
      "employeeNameFormatted",
      "assignedToNameFormatted",
      "projectNameFormatted",
      "hoursWorkedFormatted",
      "progressFormatted",
      "daysFormatted",
    ],
    []
  );

  // Extract and filter column headers from first row
  const columns = useMemo(() => {
    if (rows.length === 0) return [];

    const firstRow = rows[0] as Record<string, unknown>;
    if (firstRow && typeof firstRow === "object") {
      const allKeys = Object.keys(firstRow);
      // Filter out excluded fields
      return allKeys.filter((key) => !excludedFields.includes(key));
    }

    return [];
  }, [rows, excludedFields]);

  // Get display value for a cell (prefer formatted version if available)
  const getCellValue = useCallback(
    (rowData: Record<string, unknown>, column: string): unknown => {
      // Map of column names to their formatted field names
      const formattedFieldMap: Record<string, string> = {
        date: "dateFormatted",
        start_date: "startDateFormatted",
        end_date: "endDateFormatted",
        due_date: "dueDateFormatted",
        hire_date: "hireDateFormatted",
        timestamp: "timestampFormatted",
        check_in_time: "checkInTimeFormatted",
        check_out_time: "checkOutTimeFormatted",
        applied_date: "appliedDateFormatted",
        status: "statusLabel",
        employee_name: "employeeNameFormatted",
        assigned_to: "assignedToNameFormatted",
        project_name: "projectNameFormatted",
        hours_worked: "hoursWorkedFormatted",
        progress: "progressFormatted",
        days: "daysFormatted",
      };

      // Check if there's a formatted version for this column
      const formattedKey = formattedFieldMap[column];
      if (formattedKey && formattedKey in rowData) {
        return rowData[formattedKey];
      }

      // Return original value
      return rowData[column];
    },
    []
  );

  // Format cell value for display
  const formatCellValue = useCallback((value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "number") return value.toLocaleString();
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  }, []);

  // Format column header (convert snake_case to Title Case)
  const formatColumnHeader = useCallback((key: string): string => {
    // Special handling for common fields
    const headerMap: Record<string, string> = {
      employee_id: "Employee ID",
      employee_name: "Employee Name",
      check_in_time: "Check In Time",
      check_out_time: "Check Out Time",
      hours_worked: "Hours Worked",
      applied_date: "Applied Date",
      start_date: "Start Date",
      end_date: "End Date",
      due_date: "Due Date",
      hire_date: "Hire Date",
      project_id: "Project ID",
      project_name: "Project Name",
      task_id: "Task ID",
      task_name: "Task Name",
      leave_id: "Leave ID",
      attendance_id: "Attendance ID",
    };

    if (headerMap[key]) {
      return headerMap[key];
    }

    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, []);

  // Get status badge color
  const getStatusBadgeVariant = useCallback(
    (rowData: Record<string, unknown>): "success" | "warning" | "error" | "info" | "default" => {
      const badgeColor = rowData.statusBadgeColor as string | undefined;
      if (badgeColor === "success") return "success";
      if (badgeColor === "warning") return "warning";
      if (badgeColor === "error") return "error";
      if (badgeColor === "info") return "info";
      return "default";
    },
    []
  );

  // Handle row export
  const handleExportRow = useCallback(
    (e: React.MouseEvent, rowData: Record<string, unknown>) => {
      e.stopPropagation(); // Prevent row click
      if (onExportRow) {
        onExportRow(rowData);
      }
    },
    [onExportRow]
  );

  if (rows.length === 0) {
    return (
      <div
        style={{
          padding: `${spacing[12]} ${spacing[6]}`,
          textAlign: "center",
          color: colors.textMuted,
          fontSize: typography.fontSize.body,
          fontFamily: typography.fontFamily,
        }}
      >
        No data to display
      </div>
    );
  }

  // R14: Memoize action cell style
  const actionCellStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    } as const),
    []
  );

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          {columns.map((column) => (
            <TableCell key={column} header>
              {formatColumnHeader(column)}
            </TableCell>
          ))}
          {canExport && onExportRow && (
            <TableCell key="actions" header>
              Actions
            </TableCell>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, rowIndex) => {
          const rowData = row as Record<string, unknown>;

          return (
            <TableRow key={rowIndex}>
              {columns.map((column) => {
                const value = getCellValue(rowData, column);
                const isStatus = column === "status";

                return (
                  <TableCell key={column}>
                    {isStatus && rowData.statusBadgeColor ? (
                      <Badge variant={getStatusBadgeVariant(rowData)}>
                        {formatCellValue(value)}
                      </Badge>
                    ) : (
                      formatCellValue(value)
                    )}
                  </TableCell>
                );
              })}
              {canExport && onExportRow && (
                <TableCell>
                  <div style={actionCellStyle}>
                    {/* Only show export button if row has employee identifier */}
                    {(rowData.employee_id || rowData.assigned_to) ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={(e) => handleExportRow(e, rowData)}
                      >
                        Export
                      </Button>
                    ) : (
                      <span style={{ color: colors.textMuted, fontSize: typography.fontSize.small }}>
                        —
                      </span>
                    )}
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
});


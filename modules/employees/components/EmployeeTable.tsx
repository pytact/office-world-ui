// Employee Table Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives

"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui";
import { Badge } from "@/components/ui/Badge";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { colors, typography } from "@/theme/tokens";
import type { TransformedEmployeeSummary } from "@/hooks/useEmployeeTransformations";

interface EmployeeTableProps {
  employees: TransformedEmployeeSummary[];
}

// Memoized style objects to prevent re-renders (R15)
const linkStyle= {
  color: colors.primary,
  textDecoration: "none",
  fontFamily: typography.fontFamily,
};

export const EmployeeTable = React.memo(function EmployeeTable({
  employees,
}: EmployeeTableProps) {
  const router = useRouter();
  const { canViewEmployeeDetail } = useEmployeePermissions();

  // Handle row click navigation
  const handleRowClick = useCallback(
    (employeeId: string) => {
      if (canViewEmployeeDetail) {
        router.push(employeeRoutes.company.detail(employeeId));
      }
    },
    [router, canViewEmployeeDetail]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell header>Name</TableCell>
          <TableCell header>Email</TableCell>
          <TableCell header>Job Title</TableCell>
          <TableCell header>Department</TableCell>
          <TableCell header>Employment Status</TableCell>
          <TableCell header>Status</TableCell>
          <TableCell header>Joining Date</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow
            key={employee.employee_id}
            hover={canViewEmployeeDetail}
            onClick={
              canViewEmployeeDetail
                ? () => handleRowClick(employee.employee_id)
                : undefined
            }
          >
            <TableCell>
              {canViewEmployeeDetail ? (
                <Link
                  href={employeeRoutes.company.detail(employee.employee_id)}
                  style={linkStyle}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRowClick(employee.employee_id);
                  }}
                >
                  {employee.user.full_name}
                </Link>
              ) : (
                employee.user.full_name
              )}
            </TableCell>
            <TableCell>{employee.user.email}</TableCell>
            <TableCell>{employee.job_title || "—"}</TableCell>
            <TableCell>{employee.departmentLabel || "—"}</TableCell>
            <TableCell>{employee.employmentStatusLabel}</TableCell>
            <TableCell>
              <Badge variant={employee.statusBadge === "active" ? "success" : "default"}>
                {employee.statusBadge === "active" ? "Active" : "Inactive"}
              </Badge>
            </TableCell>
            <TableCell>{employee.joiningDateFormatted}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});


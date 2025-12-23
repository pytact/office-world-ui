// Employee List UI Component
// SCR_EMPLOYEE_LIST - Pure UI component following R7
// Composes UI primitives following R16

"use client";

import React, { useMemo, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { EmployeeTable } from "./EmployeeTable";
import { EmployeeFilters } from "./EmployeeFilters";
import { EmployeePagination } from "./EmployeePagination";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedEmployeeSummary } from "@/hooks/useEmployeeTransformations";
import type { useEmployeeFilters } from "@/hooks/useEmployeeFilters";
import type { useEmployeePagination } from "@/hooks/useEmployeePagination";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";

interface EmployeeListProps {
  employees: TransformedEmployeeSummary[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage: string | null;
    prevPage: string | null;
  };
  filters: ReturnType<typeof useEmployeeFilters>;
  paginationControls: ReturnType<typeof useEmployeePagination>;
}

export const EmployeeList = React.memo(function EmployeeList({
  employees,
  pagination,
  filters,
  paginationControls,
}: EmployeeListProps) {
  const { canCreateEmployee } = useEmployeePermissions();

  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing[8],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.borderDefault}`,
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
    } as const),
    []
  );

  const filtersContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const tableContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={headingStyle}>Employees</h1>
        {canCreateEmployee && (
          <Link href={employeeRoutes.company.create}>
            <Button type="button">Create Employee</Button>
          </Link>
        )}
      </div>

      <div style={filtersContainerStyle}>
        <EmployeeFilters filters={filters} />
      </div>

      <div style={tableContainerStyle}>
        <EmployeeTable employees={employees} />
      </div>

      <EmployeePagination
        pagination={pagination}
        paginationControls={paginationControls}
      />
    </div>
  );
});


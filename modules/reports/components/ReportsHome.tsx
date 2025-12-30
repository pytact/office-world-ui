// Reports Home UI Component
// SCR_REPORTS_HOME - Pure UI component following R17 UX Intent
// R17: Decision Screen - Primary Intent: Choose a report type
// Visual Priority: Report type cards (dominant)

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { colors, typography, spacing, borderRadius } from "@/theme/tokens";
import { ReportTypeResponse } from "@/utils/types/responses/report";

interface ReportsHomeProps {
  reportTypes: ReportTypeResponse[];
  availableReportCount?: number;
  onReportClick: (reportTypeCode: string) => void;
}

/**
 * Reports Home UI Component
 * R17 UX Intent:
 * - Screen Classification: Decision Screen
 * - Primary Intent: Choose a report type
 * - Primary Action: Click report type card
 * - Attention Anchor: Page title, then report cards
 * - Density: Overview (data-light)
 * - Frequency: Medium-Frequency
 * 
 * R14 Performance: Memoized component to prevent unnecessary re-renders
 */
export const ReportsHome = React.memo(function ReportsHome({
  reportTypes,
  availableReportCount,
  onReportClick,
}: ReportsHomeProps) {
  // R17: Visual Priority List (Top → Bottom):
  // 1. Page title: "Reports & Analytics"
  // 2. Brief description
  // 3. Report type cards grid (primary focus)

  // R14: Memoize container style to prevent re-creation
  const containerStyle = React.useMemo(
    () => ({
      padding: spacing[6],
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  // R14: Memoize header style
  const headerStyle = React.useMemo(
    () => ({
      marginBottom: spacing[8],
    } as const),
    []
  );

  // R14: Memoize title style
  const titleStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[2],
    } as const),
    []
  );

  // R14: Memoize description style
  const descriptionStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
      lineHeight: 1.6,
    } as const),
    []
  );

  // R14: Memoize count style
  const countStyle = React.useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
      marginTop: spacing[2],
      fontWeight: typography.fontWeight.medium,
    } as const),
    []
  );

  // R14: Memoize table container style
  const tableContainerStyle = React.useMemo(
    () => ({
      marginTop: spacing[6],
    } as const),
    []
  );

  // R14: Memoize click handler to prevent inline function
  const handleReportClick = React.useCallback(
    (reportTypeCode: string) => {
      onReportClick(reportTypeCode);
    },
    [onReportClick]
  );

  // R14: Memoize badge style for code column
  const badgeStyle = React.useMemo(
    () => ({
      display: "inline-flex",
      alignItems: "center",
      padding: `${spacing[1]} ${spacing[3]}`,
      backgroundColor: colors.infoBg,
      color: colors.primary,
      borderRadius: borderRadius.sm,
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      textTransform: "uppercase",
    } as const),
    []
  );

  // R14: Memoize description cell style
  const descriptionCellStyle = React.useMemo(
    () => ({
      color: colors.textMuted,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      lineHeight: 1.5,
    } as const),
    []
  );

  // R14: Memoize action cell style
  const actionCellStyle = React.useMemo(
    () => ({
      color: colors.primary,
      fontSize: typography.fontSize.body,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      cursor: "pointer",
    } as const),
    []
  );

  // R14: Memoize name cell style
  const nameCellStyle = React.useMemo(
    () => ({
      fontWeight: typography.fontWeight.semibold,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
    } as const),
    []
  );

  return (
    <div style={containerStyle}>
      {/* R17: Attention Anchor - Page Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Reports & Analytics</h1>
        <p style={descriptionStyle}>
          Select a report type to view aggregated data and insights
        </p>
        {availableReportCount !== undefined && (
          <p style={countStyle}>
            {availableReportCount} {availableReportCount === 1 ? "report" : "reports"} available
          </p>
        )}
      </div>

      {/* R17: Primary Focus - Report Type Table */}
      <div style={tableContainerStyle}>
        <Card variant="elevated" padding="lg">
          <Table>
            <TableHeader>
              <TableRow hover={false}>
                <TableCell header>Code</TableCell>
                <TableCell header>Report Name</TableCell>
                <TableCell header>Description</TableCell>
                <TableCell header>Action</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportTypes.map((reportType) => (
                <TableRow
                  key={reportType.code}
                  onClick={() => handleReportClick(reportType.code)}
                  hover
                >
                  <TableCell>
                    <div style={badgeStyle}>{reportType.code}</div>
                  </TableCell>
                  <TableCell>
                    <span style={nameCellStyle}>
                      {reportType.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={descriptionCellStyle}>
                      {reportType.description || "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span style={actionCellStyle}>View Report →</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
});



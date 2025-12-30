// Report View UI Component
// SCR_REPORT_VIEW - Pure UI component following R17 UX Intent
// R17: Monitoring Screen - Primary Intent: Review filtered report data
// Visual Priority: Export button (dominant), then data visualization

"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ReportFilters } from "./ReportFilters";
import { ReportTable } from "./ReportTable";
import { ReportPagination } from "./ReportPagination";
import { colors, typography, spacing, borderRadius, shadows } from "@/theme/tokens";
import { ReportMetadata, ReportTotals } from "@/utils/types/responses/report";
import { useReportFilters } from "@/hooks/useReportFilters";
import { useReportPagination } from "@/hooks/useReportPagination";

interface ReportViewProps {
  reportType: string;
  metadata: ReportMetadata | null;
  rows: unknown[];
  totals: ReportTotals | null;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    rowCount: number | null;
  };
  hasPagination: boolean;
  filters: ReturnType<typeof useReportFilters>;
  paginationControls: ReturnType<typeof useReportPagination>;
  canExport: boolean;
  isExporting: boolean;
  exportProgress: string | null;
  onExport: () => void;
  onExportRow?: (rowData: Record<string, unknown>) => void;
  onBack: () => void;
}

/**
 * Report View UI Component
 * R17 UX Intent:
 * - Screen Classification: Monitoring Screen
 * - Primary Intent: Review filtered report data
 * - Primary Action: Export Report as PDF
 * - Attention Anchor: Report header, then Export button
 * - Density: Data-Heavy
 * - Frequency: High-Frequency
 * 
 * R14 Performance: Memoized component to prevent unnecessary re-renders
 */
export const ReportView = React.memo(function ReportView({
  reportType,
  metadata,
  rows,
  totals,
  pagination,
  hasPagination,
  filters,
  paginationControls,
  canExport,
  isExporting,
  exportProgress,
  onExport,
  onExportRow,
  onBack,
}: ReportViewProps) {
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const toggleFilters = useCallback(() => {
    setFiltersExpanded((prev) => !prev);
  }, []);

  // R14: Memoize container style
  const containerStyle = useMemo(
    () => ({
      padding: spacing[6],
      maxWidth: "1400px",
      margin: "0 auto",
    } as const),
    []
  );

  // R14: Memoize header style
  const headerStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: spacing[6],
      gap: spacing[4],
    } as const),
    []
  );

  // R14: Memoize header content style
  const headerContentStyle = useMemo(
    () => ({
      flex: 1,
    } as const),
    []
  );

  // R14: Memoize badge container style
  const badgeContainerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center",
      gap: spacing[3],
      marginBottom: spacing[2],
    } as const),
    []
  );

  // R14: Memoize badge style
  const badgeStyle = useMemo(
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

  // R14: Memoize title style
  const titleStyle = useMemo(
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
  const descriptionStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
      lineHeight: 1.6,
      margin: 0,
    } as const),
    []
  );

  // R14: Memoize export container style
  const exportContainerStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column" as const,
      gap: spacing[2],
    } as const),
    []
  );

  // R14: Memoize export progress style
  const exportProgressStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      textAlign: "center" as const,
      margin: 0,
    } as const),
    []
  );

  // R14: Memoize filter section style
  const filterSectionStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // R14: Memoize filter header style
  const filterHeaderStyle = useMemo(
    () => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: filtersExpanded ? spacing[4] : 0,
    } as const),
    [filtersExpanded]
  );

  // R14: Memoize filter title style
  const filterTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      margin: 0,
    } as const),
    []
  );

  // R14: Memoize filter toggle style
  const filterToggleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      color: colors.primary,
      cursor: "pointer",
      border: "none",
      background: "none",
      padding: 0,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  // R14: Memoize data section style
  const dataSectionStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // R14: Memoize totals section style
  const totalsSectionStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  // R14: Memoize summary title style
  const summaryTitleStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[4],
    } as const),
    []
  );

  // R14: Memoize totals grid style
  const totalsGridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: spacing[4],
    } as const),
    []
  );

  // R14: Memoize total item style
  const totalItemStyle = useMemo(
    () => ({
      padding: spacing[3],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: borderRadius.md,
    } as const),
    []
  );

  // R14: Memoize total label style
  const totalLabelStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[1],
      textTransform: "capitalize" as const,
    } as const),
    []
  );

  // R14: Memoize total value style
  const totalValueStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h3,
      fontWeight: typography.fontWeight.bold,
      color: colors.textPrimary,
      fontFamily: typography.fontFamily,
    } as const),
    []
  );

  // R14: Memoize back button style
  const backButtonStyle = useMemo(
    () => ({
      marginRight: spacing[2],
    } as const),
    []
  );

  // R17: Visual Priority List (Top → Bottom):
  // 1. Report header: Title + description + Export button (primary CTA)
  // 2. Filter bar (collapsible, secondary)
  // 3. Data visualization area (tables/charts) - main content
  // 4. Totals/summary section (if applicable)
  // 5. Pagination controls (if applicable)

  return (
    <div style={containerStyle}>
      {/* R17: Attention Anchor - Report Header with Export Button */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div style={badgeContainerStyle}>
            <Button
              variant="secondary"
              size="sm"
              onClick={onBack}
              style={backButtonStyle}
            >
              ← Back
            </Button>
            <div style={badgeStyle}>{reportType}</div>
          </div>
          <h1 style={titleStyle}>
            {metadata?.title || `${reportType} Report`}
          </h1>
          {metadata?.description && (
            <p style={descriptionStyle}>{metadata.description}</p>
          )}
        </div>

        {/* R17: Primary Action - Export Button (Dominant) */}
        {canExport && (
          <div style={exportContainerStyle}>
            <Button
              variant="primary"
              size="lg"
              onClick={onExport}
              disabled={isExporting}
              isLoading={isExporting}
            >
              {isExporting
                ? exportProgress || "Exporting..."
                : "Export as PDF"}
            </Button>
            {exportProgress && !isExporting && (
              <p style={exportProgressStyle}>{exportProgress}</p>
            )}
          </div>
        )}
      </div>

      {/* R17: Secondary - Filter Bar (Collapsible) */}
      <div style={filterSectionStyle}>
        <Card variant="outlined" padding="md">
          <div style={filterHeaderStyle}>
            <h3 style={filterTitleStyle}>Filters</h3>
            <button onClick={toggleFilters} style={filterToggleStyle}>
              {filtersExpanded ? "Collapse" : "Expand"}
            </button>
          </div>
          {filtersExpanded && (
            <ReportFilters
              filters={filters}
              filterOptions={metadata?.filter_options || null}
            />
          )}
        </Card>
      </div>

      {/* R17: Primary Content - Data Visualization */}
      <div style={dataSectionStyle}>
        <Card variant="elevated" padding="lg">
          <ReportTable
            rows={rows}
            metadata={metadata}
            reportType={reportType}
            onExportRow={onExportRow}
            canExport={canExport && !!onExportRow}
          />
        </Card>
      </div>

      {/* Totals Section (if applicable) */}
      {totals && Object.keys(totals).length > 0 && (
        <div style={totalsSectionStyle}>
          <Card variant="outlined" padding="md">
            <h3 style={summaryTitleStyle}>Summary</h3>
            <div style={totalsGridStyle}>
              {Object.entries(totals).map(([key, value]) => (
                <div key={key} style={totalItemStyle}>
                  <div style={totalLabelStyle}>
                    {key.replace(/_/g, " ")}
                  </div>
                  <div style={totalValueStyle}>
                    {typeof value === "number"
                      ? value.toLocaleString()
                      : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Pagination Controls (if applicable) */}
      {hasPagination && (
        <ReportPagination
          pagination={pagination}
          paginationControls={paginationControls}
        />
      )}
    </div>
  );
});


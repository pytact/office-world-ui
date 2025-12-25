// Salary Payment History Table Component
// Feature-specific component - R16 Layer 2
// Displays payment history in table format (SECONDARY visual hierarchy)
// Following R17 UX Intent: Secondary, always visible

"use client";

import React, { useMemo, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/Table";
import { EmptyState } from "@/components/ui/EmptyState";
import { spacing, typography, colors } from "@/theme/tokens";
import type { TransformedSalaryPayment } from "@/hooks/useSalaryTransformations";

interface SalaryPaymentHistoryTableProps {
  payments: TransformedSalaryPayment[];
  isLoading?: boolean;
  onDownloadSlip?: (paymentId: string, slipUrl: string) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPageChange?: (page: number) => void;
}

export const SalaryPaymentHistoryTable = React.memo(
  function SalaryPaymentHistoryTable({
    payments,
    isLoading = false,
    onDownloadSlip,
    pagination,
    onPageChange,
  }: SalaryPaymentHistoryTableProps) {
    // Memoized styles following R12 (Figma alignment)
    const sectionStyle = useMemo(
      () => ({
        marginBottom: spacing[8],
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

    const titleStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.h4,
        fontFamily: typography.fontFamily,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        margin: 0,
      } as const),
      []
    );

    const paginationStyle = useMemo(
      () => ({
        display: "flex",
        justifyContent: "space-between" as const,
        alignItems: "center" as const,
        marginTop: spacing[4],
        gap: spacing[4],
      } as const),
      []
    );

    const paginationInfoStyle = useMemo(
      () => ({
        fontSize: typography.fontSize.small,
        fontFamily: typography.fontFamily,
        color: colors.textMuted,
      } as const),
      []
    );

    const paginationButtonsStyle = useMemo(
      () => ({
        display: "flex",
        gap: spacing[2],
      } as const),
      []
    );

    const handleDownloadClick = useCallback(
      (paymentId: string, slipUrl: string) => {
        if (onDownloadSlip) {
          onDownloadSlip(paymentId, slipUrl);
        }
      },
      [onDownloadSlip]
    );

    const handlePreviousPage = useCallback(() => {
      if (onPageChange && pagination) {
        onPageChange(pagination.page - 1);
      }
    }, [onPageChange, pagination]);

    const handleNextPage = useCallback(() => {
      if (onPageChange && pagination) {
        onPageChange(pagination.page + 1);
      }
    }, [onPageChange, pagination]);

    if (isLoading) {
      return (
        <div style={sectionStyle}>
          <Card padding="md">
            <p style={paginationInfoStyle}>Loading payment history...</p>
          </Card>
        </div>
      );
    }

    if (payments.length === 0) {
      return (
        <div style={sectionStyle}>
          <div style={headerStyle}>
            <h3 style={titleStyle}>Payment History</h3>
          </div>
          <Card padding="md">
            <EmptyState
              message="No Payment History"
              description="No salary payments have been recorded yet."
            />
          </Card>
        </div>
      );
    }

    return (
      <div style={sectionStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>
            Payment History
            {pagination && ` (${pagination.total} total)`}
          </h3>
        </div>
        <Card padding="md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell header>Period</TableCell>
                <TableCell header>Amount</TableCell>
                <TableCell header>Payment Method</TableCell>
                <TableCell header>Paid On</TableCell>
                <TableCell header>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.paymentPeriodLabel}</TableCell>
                  <TableCell>{payment.amountFormatted}</TableCell>
                  <TableCell>{payment.paymentMethodLabel}</TableCell>
                  <TableCell>{payment.paidOnFormatted}</TableCell>
                  <TableCell>
                    {onDownloadSlip && payment.slip_url && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadClick(payment.id, payment.slip_url)}
                      >
                        Download Slip
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pagination && pagination.totalPages > 1 && (
            <div style={paginationStyle}>
              <p style={paginationInfoStyle}>
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div style={paginationButtonsStyle}>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={!pagination.hasPreviousPage}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    );
  }
);


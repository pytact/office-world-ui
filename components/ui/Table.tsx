// Table Component
// Reusable UI Primitive - R16
// Following ui_foundation.config.md - Section 10

"use client";

import React from "react";
import { colors, spacing, typography } from "@/theme/tokens";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

export function Table({ children, className = "" }: TableProps) {
  return (
    <table
      className={className}
      style={{
        width: "100%",
        backgroundColor: colors.backgroundPrimary,
        borderCollapse: "collapse",
      }}
    >
      {children}
    </table>
  );
}

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead
      className={className}
      style={{
        backgroundColor: colors.backgroundSecondary,
        borderBottom: `2px solid ${colors.borderDefault}`,
      }}
    >
      {children}
    </thead>
  );
}

export function TableBody({ children, className = "" }: TableBodyProps) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  children,
  className = "",
  onClick,
  hover = true,
}: TableRowProps) {
  return (
    <tr
      className={className}
      onClick={onClick}
      style={{
        cursor: onClick ? "pointer" : "default",
        borderBottom: `1px solid ${colors.borderLight}`,
      }}
      onMouseEnter={(e) => {
        if (hover && onClick) {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          e.currentTarget.style.backgroundColor = colors.backgroundPrimary;
        }
      }}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  className = "",
  header = false,
}: TableCellProps) {
  const Component = header ? "th" : "td";
  return (
    <Component
      className={className}
      style={{
        padding: spacing[4],
        textAlign: header ? "left" : "left",
        fontWeight: header ? typography.fontWeight.semibold : typography.fontWeight.normal,
        fontSize: header ? typography.fontSize.small : typography.fontSize.body,
        color: header ? colors.textPrimary : colors.textPrimary,
        fontFamily: typography.fontFamily,
        textTransform: header ? "uppercase" : "none",
        letterSpacing: header ? "0.025em" : "normal",
      }}
    >
      {children}
    </Component>
  );
}


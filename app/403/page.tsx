// 403 Forbidden Page
// Access denied page for unauthorized role access

"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { spacing, typography, colors } from "@/theme/tokens";

export default function ForbiddenPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: spacing[6],
        textAlign: "center",
      }}
    >
      <h1
        style={{
          fontSize: typography.fontSize.h1,
          fontFamily: typography.fontFamily,
          fontWeight: typography.fontWeight.medium,
          color: colors.error,
          marginBottom: spacing[4],
        }}
      >
        403 - Forbidden
      </h1>
      <p
        style={{
          fontSize: typography.fontSize.body,
          fontFamily: typography.fontFamily,
          color: colors.textMuted,
          marginBottom: spacing[6],
        }}
      >
        You don't have permission to access this page.
      </p>
      <Link href="/">
        <Button type="button">Go to Dashboard</Button>
      </Link>
    </div>
  );
}


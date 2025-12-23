// Root Layout
// Server Component - provides global layout structure
// Client providers are in AppProviders component

import React from "react";
import { AppProviders } from "@/components/providers/AppProviders";
import { MainLayout } from "@/components/layout/main-layout/MainLayout";
import { typography, colors } from "@/theme/tokens";
import "@/theme/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>officeWorld</title>
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: typography.fontFamily,
          backgroundColor: colors.backgroundPrimary,
          color: colors.textPrimary,
        }}
      >
        <AppProviders>
          <MainLayout>{children}</MainLayout>
        </AppProviders>
      </body>
    </html>
  );
}


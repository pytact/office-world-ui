// Main Layout Wrapper
// Client component to conditionally apply sidebar margin
// Hides sidebar margin on login page

"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppHeader } from "@/components/layout/header/AppHeader";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login" || pathname?.startsWith("/login");

  return (
    <>
      <Sidebar />
      <div style={{ marginLeft: isLoginPage ? "0" : "260px" }}>
        <AppHeader />
        {children}
      </div>
    </>
  );
}


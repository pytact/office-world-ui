// App Providers
// Client-side providers wrapper for Next.js App Router
// Separates Server and Client Component boundaries

"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, ProjectProvider, TaskProvider } from "@/context";
import { ToastProvider } from "@/context/ToastContext";

interface AppProvidersProps {
  children: React.ReactNode;
}

/**
 * App Providers Component
 * Wraps all client-side providers
 * QueryClient is created on client side to avoid serialization issues
 */
export function AppProviders({ children }: AppProvidersProps) {
  // Create QueryClient on client side using useState
  // This ensures it's only created once per component lifecycle
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds
            gcTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProjectProvider>
          <TaskProvider>
            <ToastProvider>{children}</ToastProvider>
          </TaskProvider>
        </ProjectProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}


// Project Context
// Feature-specific project context provider and custom hook
// F-007: Project Management

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useProjectPermissions } from "@/hooks/useProjectPermissions";

interface ProjectContextValue {
  // Permissions (derived from user role)
  permissions: ReturnType<typeof useProjectPermissions>;

  // User role information (from AuthContext)
  userRole: "ceo" | "manager" | "hr" | "employee" | null;
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;

  // Computed access flags
  canCreateProject: boolean;
  canUpdateProject: boolean;
  canDeleteProject: boolean;
  canViewAllProjects: boolean;
  isReadOnly: boolean;
}

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

interface ProjectProviderProps {
  children: React.ReactNode;
}

/**
 * Project Context Provider
 * Manages project-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useProjectPermissions hook for permission logic
 * 
 * Note: This context provides permissions and role information.
 * For project data, use the React Query hooks (useListProjects, useGetProject, etc.)
 */
export function ProjectProvider({ children }: ProjectProviderProps) {
  const { user } = useAuthContext();
  
  // Get user role from AuthContext
  const userRole = useMemo(() => {
    if (!user?.role) return null;
    const role = user.role.toLowerCase();
    if (["ceo", "manager", "hr", "employee"].includes(role)) {
      return role as "ceo" | "manager" | "hr" | "employee";
    }
    return null;
  }, [user?.role]);

  // Get permissions based on user role
  const permissions = useProjectPermissions({ userRole });

  // Role flags
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  const value: ProjectContextValue = {
    permissions,
    userRole,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canCreateProject: permissions.canCreateProject,
    canUpdateProject: permissions.canUpdateProject,
    canDeleteProject: permissions.canDeleteProject,
    canViewAllProjects: permissions.canViewAllProjects,
    isReadOnly: permissions.isReadOnly,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}

/**
 * Custom hook to consume Project Context
 * Must be used within ProjectProvider
 * Following R7 rules: Context consumed via custom hook
 * 
 * @returns Project context value
 * @throws Error if used outside ProjectProvider
 */
export function useProjectContext(): ProjectContextValue {
  const context = useContext(ProjectContext);

  if (context === undefined) {
    throw new Error(
      "useProjectContext must be used within a ProjectProvider"
    );
  }

  return context;
}


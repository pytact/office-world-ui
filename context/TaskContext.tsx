// Task Context
// Feature-specific task context provider and custom hook
// F-008: Task Management & Assignment

"use client";

import React, { createContext, useContext, useMemo } from "react";
import { useAuthContext } from "./AuthContext";
import { useTaskPermissions } from "@/hooks/useTaskPermissions";

interface TaskContextValue {
  // Permissions (derived from user role)
  // Note: Task-specific permissions (can_edit_task, can_change_status) come from task data
  // This context provides role-based general permissions
  permissions: ReturnType<typeof useTaskPermissions>;

  // User role information (from AuthContext)
  userRole: "ceo" | "manager" | "hr" | "employee" | null;
  isCEO: boolean;
  isManager: boolean;
  isHR: boolean;
  isEmployee: boolean;

  // Computed access flags (role-based, not task-specific)
  canCreateTask: boolean;
  canViewAllTasks: boolean;
  isReadOnly: boolean;
}

const TaskContext = createContext<TaskContextValue | undefined>(undefined);

interface TaskProviderProps {
  children: React.ReactNode;
}

/**
 * Task Context Provider
 * Manages task-related permissions and access control
 * Integrates with AuthContext for user role information
 * Uses useTaskPermissions hook for permission logic
 * 
 * Note: This context provides role-based general permissions.
 * Task-specific permissions (can_edit_task, can_change_status, etc.) are derived
 * from task data and should be obtained using useTaskPermissions hook with task data.
 * 
 * For task data, use the React Query hooks (useListTasks, useGetTask, etc.)
 */
export function TaskProvider({ children }: TaskProviderProps) {
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

  // Get general permissions based on user role (no specific task)
  const permissions = useTaskPermissions({ userRole });

  // Role flags
  const isCEO = useMemo(() => userRole === "ceo", [userRole]);
  const isManager = useMemo(() => userRole === "manager", [userRole]);
  const isHR = useMemo(() => userRole === "hr", [userRole]);
  const isEmployee = useMemo(() => userRole === "employee", [userRole]);

  const value: TaskContextValue = {
    permissions,
    userRole,
    isCEO,
    isManager,
    isHR,
    isEmployee,
    canCreateTask: permissions.canCreateTask,
    canViewAllTasks: permissions.canViewAllTasks,
    isReadOnly: permissions.isReadOnly,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

/**
 * Custom hook to consume Task Context
 * Must be used within TaskProvider
 * Following R6 rules: Context consumed via custom hook
 * 
 * @returns Task context value
 * @throws Error if used outside TaskProvider
 */
export function useTaskContext(): TaskContextValue {
  const context = useContext(TaskContext);

  if (context === undefined) {
    throw new Error(
      "useTaskContext must be used within a TaskProvider"
    );
  }

  return context;
}


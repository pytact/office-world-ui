// Task Form Hook
// Encapsulates form state and business logic for task create/edit
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { TaskCreate, TaskStatus } from "@/utils/types/requests/task";

interface UseTaskFormParams {
  initialName?: string;
  initialDescription?: string;
  initialProjectId?: string | null;
  initialStatus?: TaskStatus;
}

interface UseTaskFormReturn {
  // Form state
  name: string;
  description: string;
  projectId: string | null;
  status: TaskStatus;
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setProjectId: (projectId: string | null) => void;
  setStatus: (status: TaskStatus) => void;

  // Computed values
  isValid: boolean;
  nameLength: number;
  descriptionLength: number;
  hasSelectedProject: boolean;

  // Handlers
  resetForm: () => void;
  getCreatePayload: () => TaskCreate;
  getUpdatePayload: () => { name?: string; description?: string };
}

/**
 * Hook for managing task form state and business logic
 * Handles form validation and payload generation
 * @param params - Initial form values
 * @returns Form state, computed values, and handlers
 */
export function useTaskForm(
  params?: UseTaskFormParams
): UseTaskFormReturn {
  const [name, setName] = useState(params?.initialName || "");
  const [description, setDescription] = useState(
    params?.initialDescription || ""
  );
  const [projectId, setProjectId] = useState<string | null>(
    params?.initialProjectId ?? null
  );
  const [status, setStatus] = useState<TaskStatus>(
    params?.initialStatus || "TODO"
  );

  // Computed: Form validation
  const nameLength = useMemo(() => name.length, [name]);
  const descriptionLength = useMemo(() => description.length, [description]);

  const isValid = useMemo(() => {
    return (
      name.trim().length >= 1 &&
      name.trim().length <= 255 &&
      description.length <= 5000 &&
      status === "TODO" // Initial status must be TODO for creation
    );
  }, [name, description, status]);

  const hasSelectedProject = useMemo(() => {
    return projectId !== null && projectId !== undefined;
  }, [projectId]);

  const resetForm = useCallback(() => {
    setName("");
    setDescription("");
    setProjectId(null);
    setStatus("TODO");
  }, []);

  const getCreatePayload = useCallback((): TaskCreate => {
    return {
      name: name.trim(),
      description: description.trim() || undefined,
      status: "TODO", // Always TODO for new tasks
      project_id: projectId || undefined,
    };
  }, [name, description, projectId]);

  const getUpdatePayload = useCallback(() => {
    return {
      name: name.trim() || undefined,
      description: description.trim() || undefined,
    };
  }, [name, description]);

  return {
    name,
    description,
    projectId,
    status,
    setName,
    setDescription,
    setProjectId,
    setStatus,
    isValid,
    nameLength,
    descriptionLength,
    hasSelectedProject,
    resetForm,
    getCreatePayload,
    getUpdatePayload,
  };
}


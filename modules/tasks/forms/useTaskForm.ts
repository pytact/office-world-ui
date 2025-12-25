// Task Form Hook
// React Hook Form setup for task forms
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskCreateSchema, TaskCreateFormSchema } from "./task.schema";

interface UseTaskFormParams {
  defaultValues?: Partial<TaskCreateFormSchema>;
}

/**
 * Hook for task creation form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useTaskForm(params?: UseTaskFormParams) {
  const defaultValues: TaskCreateFormSchema = {
    name: params?.defaultValues?.name || "",
    description: params?.defaultValues?.description || null,
    project_id: params?.defaultValues?.project_id || null,
  };

  const form = useForm<TaskCreateFormSchema>({
    resolver: zodResolver(TaskCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first blur
  });

  return form;
}


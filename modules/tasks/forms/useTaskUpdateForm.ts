// Task Update Form Hook
// React Hook Form setup for task update forms
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TaskUpdateSchema,
  TaskUpdateFormSchema,
} from "./task.schema";

interface UseTaskUpdateFormParams {
  defaultValues?: Partial<TaskUpdateFormSchema>;
}

/**
 * Hook for task update form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useTaskUpdateForm(
  params?: UseTaskUpdateFormParams
) {
  const defaultValues: TaskUpdateFormSchema = {
    name: params?.defaultValues?.name ?? null,
    description: params?.defaultValues?.description ?? null,
  };

  const form = useForm<TaskUpdateFormSchema>({
    resolver: zodResolver(TaskUpdateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first blur
  });

  return form;
}


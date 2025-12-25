// Project Update Form Hook
// React Hook Form setup for project update forms
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ProjectUpdateSchema,
  ProjectUpdateFormSchema,
} from "./project.schema";

interface UseProjectUpdateFormParams {
  defaultValues?: Partial<ProjectUpdateFormSchema>;
}

/**
 * Hook for project update form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useProjectUpdateForm(
  params?: UseProjectUpdateFormParams
) {
  const defaultValues: ProjectUpdateFormSchema = {
    name: params?.defaultValues?.name ?? null,
    status: params?.defaultValues?.status ?? null,
  };

  const form = useForm<ProjectUpdateFormSchema>({
    resolver: zodResolver(ProjectUpdateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first blur
  });

  return form;
}


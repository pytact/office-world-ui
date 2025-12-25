// Project Form Hook
// React Hook Form setup for project forms
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProjectCreateSchema, ProjectCreateFormSchema } from "./project.schema";

interface UseProjectFormParams {
  defaultValues?: Partial<ProjectCreateFormSchema>;
}

/**
 * Hook for project creation form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useProjectForm(params?: UseProjectFormParams) {
  const defaultValues: ProjectCreateFormSchema = {
    name: params?.defaultValues?.name || "",
    status: params?.defaultValues?.status || "ACTIVE",
  };

  const form = useForm<ProjectCreateFormSchema>({
    resolver: zodResolver(ProjectCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first blur
  });

  return form;
}


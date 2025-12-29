// Leave Create Form Hook
// React Hook Form setup for leave creation form
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveCreateSchema, LeaveCreateFormSchema } from "./leave.schema";

interface UseLeaveCreateFormParams {
  defaultValues?: Partial<LeaveCreateFormSchema>;
}

/**
 * Hook for leave creation form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useLeaveCreateForm(params?: UseLeaveCreateFormParams) {
  const defaultValues: LeaveCreateFormSchema = {
    leave_type: params?.defaultValues?.leave_type || "CASUAL",
    start_date: params?.defaultValues?.start_date || "",
    end_date: params?.defaultValues?.end_date || "",
    day_type: params?.defaultValues?.day_type || "FULL_DAY",
    reason: params?.defaultValues?.reason || "",
    manager_approver_id: params?.defaultValues?.manager_approver_id || "",
    hr_approver_id: params?.defaultValues?.hr_approver_id || "",
  };

  const form = useForm<LeaveCreateFormSchema>({
    resolver: zodResolver(LeaveCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first blur
  });

  return form;
}


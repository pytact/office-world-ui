// Leave Rejection Form Hook
// React Hook Form setup for leave rejection modal
// Following R10 rules: Zod schema, default values, React Hook Form

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeaveRejectionSchema, LeaveRejectionFormSchema } from "./leave.schema";

interface UseLeaveRejectionFormParams {
  defaultValues?: Partial<LeaveRejectionFormSchema>;
}

/**
 * Hook for leave rejection form
 * Uses React Hook Form with Zod validation
 * Following R10 rules: Zod schema, default values, React Hook Form
 */
export function useLeaveRejectionForm(params?: UseLeaveRejectionFormParams) {
  const defaultValues: LeaveRejectionFormSchema = {
    rejection_reason: params?.defaultValues?.rejection_reason || "",
  };

  const form = useForm<LeaveRejectionFormSchema>({
    resolver: zodResolver(LeaveRejectionSchema),
    defaultValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  return form;
}


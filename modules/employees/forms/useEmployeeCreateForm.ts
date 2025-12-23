// Employee Create Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeCreateSchema, EmployeeCreateFormSchema } from "./employee.schema";

interface UseEmployeeCreateFormParams {
  defaultValues?: Partial<EmployeeCreateFormSchema>;
}

/**
 * Hook for employee creation form
 * Uses React Hook Form with Zod validation
 */
export function useEmployeeCreateForm(params?: UseEmployeeCreateFormParams) {
  const defaultValues: EmployeeCreateFormSchema = {
    user_id: params?.defaultValues?.user_id || "",
    joining_date: params?.defaultValues?.joining_date || "",
    employment_status: params?.defaultValues?.employment_status || "ACTIVE",
    job_title: params?.defaultValues?.job_title || null,
    department: params?.defaultValues?.department || null,
    employment_type: params?.defaultValues?.employment_type || null,
    employment_level: params?.defaultValues?.employment_level || null,
    work_email: params?.defaultValues?.work_email || null,
    gender: params?.defaultValues?.gender || null,
    marital_status: params?.defaultValues?.marital_status || null,
    blood_group: params?.defaultValues?.blood_group || null,
    nationality: params?.defaultValues?.nationality || null,
    address: params?.defaultValues?.address || null,
    city: params?.defaultValues?.city || null,
    state: params?.defaultValues?.state || null,
    country: params?.defaultValues?.country || null,
    document_type: params?.defaultValues?.document_type || null,
    document_number: params?.defaultValues?.document_number || null,
    separation_initiated_date: params?.defaultValues?.separation_initiated_date || null,
    separation_reason: params?.defaultValues?.separation_reason || null,
    last_working_day: params?.defaultValues?.last_working_day || null,
    notice_period_days: params?.defaultValues?.notice_period_days || null,
  };

  const form = useForm<EmployeeCreateFormSchema>({
    resolver: zodResolver(EmployeeCreateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


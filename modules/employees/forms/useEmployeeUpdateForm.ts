// Employee Update Form Hook
// Uses React Hook Form with Zod validation
// Following R10 rules

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EmployeeUpdateSchema, EmployeeUpdateFormSchema } from "./employee.schema";
import { EmployeeDetail } from "@/utils/types/responses/employee";
import type { TransformedEmployeeDetail } from "@/hooks/useEmployeeTransformations";

interface UseEmployeeUpdateFormParams {
  defaultValues?: Partial<EmployeeUpdateFormSchema>;
  employee?: EmployeeDetail | TransformedEmployeeDetail | null;
}

/**
 * Hook for employee update form
 * Uses React Hook Form with Zod validation
 * Populates default values from employee data if provided
 */
export function useEmployeeUpdateForm(params?: UseEmployeeUpdateFormParams) {
  // Build default values from employee data or provided defaults
  const defaultValues: EmployeeUpdateFormSchema = {
    employment_status: params?.employee?.employment_status || params?.defaultValues?.employment_status || null,
    job_title: params?.employee?.job_title || params?.defaultValues?.job_title || null,
    department: params?.employee?.department || params?.defaultValues?.department || null,
    employment_type: params?.employee?.employment_type || params?.defaultValues?.employment_type || null,
    employment_level: params?.employee?.employment_level || params?.defaultValues?.employment_level || null,
    work_email: params?.employee?.work_email || params?.defaultValues?.work_email || null,
    gender: params?.employee?.gender || params?.defaultValues?.gender || null,
    marital_status: params?.employee?.marital_status || params?.defaultValues?.marital_status || null,
    blood_group: params?.employee?.blood_group || params?.defaultValues?.blood_group || null,
    nationality: params?.employee?.nationality || params?.defaultValues?.nationality || null,
    address: params?.employee?.address || params?.defaultValues?.address || null,
    city: params?.employee?.city || params?.defaultValues?.city || null,
    state: params?.employee?.state || params?.defaultValues?.state || null,
    country: params?.employee?.country || params?.defaultValues?.country || null,
    document_type: params?.employee?.document_type || params?.defaultValues?.document_type || null,
    document_number: params?.employee?.document_number || params?.defaultValues?.document_number || null,
    separation_initiated_date: params?.employee?.separation_initiated_date || params?.defaultValues?.separation_initiated_date || null,
    separation_reason: params?.employee?.separation_reason || params?.defaultValues?.separation_reason || null,
    last_working_day: params?.employee?.last_working_day || params?.defaultValues?.last_working_day || null,
    notice_period_days: params?.employee?.notice_period_days || params?.defaultValues?.notice_period_days || null,
    is_active: params?.employee?.is_active ?? params?.defaultValues?.is_active ?? null,
  };

  const form = useForm<EmployeeUpdateFormSchema>({
    resolver: zodResolver(EmployeeUpdateSchema),
    defaultValues,
    mode: "onBlur", // Validate on blur for better UX
  });

  return form;
}


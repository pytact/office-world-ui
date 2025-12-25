// Employee Transformations Hook
// Encapsulates data transformations for employee display
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";

import {
  EmploymentStatus,
  Department,
  EmploymentType,
  EmploymentLevel,
  Gender,
  MaritalStatus,
  BloodGroup,
  DocumentType,
} from "@/utils/types/requests/employee";
import { EmployeeSummary, EmployeeDetail } from "@/utils/types/responses/employee";

// ENUM to Label Mappings
const EMPLOYMENT_STATUS_LABELS: Record<EmploymentStatus, string> = {
  TRAINEE: "Trainee",
  PROBATION: "On Probation",
  CONFIRMED: "Confirmed",
  NOTICE_PERIOD: "Notice Period",
  ACTIVE: "Active",
  ON_HOLD: "On Hold",
  TERMINATED: "Terminated",
  RESIGNED: "Resigned",
};

const DEPARTMENT_LABELS: Record<Department, string> = {
  FRONTEND: "Frontend",
  BACKEND: "Backend",
  FULLSTACK: "Full Stack",
  QA: "Quality Assurance",
  HR: "Human Resources",
  DEVOPS: "DevOps",
  UIUX: "UI/UX",
  PRODUCT: "Product",
  MARKETING: "Marketing",
  DATA: "Data",
  SUPPORT: "Support",
};

const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  FREELANCE: "Freelance",
  TEMPORARY: "Temporary",
};

const EMPLOYMENT_LEVEL_LABELS: Record<EmploymentLevel, string> = {
  INTERN: "Intern",
  JUNIOR: "Junior",
  MID: "Mid Level",
  SENIOR: "Senior",
  LEAD: "Lead",
  MANAGER: "Manager",
};

const GENDER_LABELS: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

const MARITAL_STATUS_LABELS: Record<MaritalStatus, string> = {
  SINGLE: "Single",
  MARRIED: "Married",
  DIVORCED: "Divorced",
  WIDOWED: "Widowed",
  SEPARATED: "Separated",
};

const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  AADHAAR: "Aadhaar",
  PAN: "PAN",
  DL: "Driving License",
  VOTER_ID: "Voter ID",
  PASSPORT: "Passport",
};

// Transformation Functions
export function getEmploymentStatusLabel(
  status: EmploymentStatus | null | undefined
): string {
  if (!status) return "—";
  return EMPLOYMENT_STATUS_LABELS[status] || status;
}

export function getDepartmentLabel(
  department: Department | null | undefined
): string {
  if (!department) return "—";
  return DEPARTMENT_LABELS[department] || department;
}

export function getEmploymentTypeLabel(
  type: EmploymentType | null | undefined
): string {
  if (!type) return "—";
  return EMPLOYMENT_TYPE_LABELS[type] || type;
}

export function getEmploymentLevelLabel(
  level: EmploymentLevel | null | undefined
): string {
  if (!level) return "—";
  return EMPLOYMENT_LEVEL_LABELS[level] || level;
}

export function getGenderLabel(gender: Gender | null | undefined): string {
  if (!gender) return "—";
  return GENDER_LABELS[gender] || gender;
}

export function getMaritalStatusLabel(
  status: MaritalStatus | null | undefined
): string {
  if (!status) return "—";
  return MARITAL_STATUS_LABELS[status] || status;
}

export function getDocumentTypeLabel(
  type: DocumentType | null | undefined
): string {
  if (!type) return "—";
  return DOCUMENT_TYPE_LABELS[type] || type;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "dd MMM yyyy");
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "—";
  try {
    return format(new Date(dateString), "dd MMM yyyy, hh:mm a");
  } catch {
    return dateString;
  }
}

export function getUserFullName(
  firstName: string | null | undefined,
  lastName: string | null | undefined
): string {
  const parts = [firstName, lastName].filter(Boolean);
  return parts.length > 0 ? parts.join(" ") : "—";
}

// Transformed Employee Summary
export interface TransformedEmployeeSummary {
  employee_id: string;
  user: {
    user_id: string;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
  };
  job_title: string;
  department: string;
  departmentLabel: string;
  employment_status: EmploymentStatus;
  employmentStatusLabel: string;
  is_active: boolean;
  statusBadge: "active" | "inactive";
  joining_date: string;
  joiningDateFormatted: string;
  created_at: string;
  createdAtFormatted: string;
  updated_at: string;
  updatedAtFormatted: string;
}

// Transformed Employee Detail
export interface TransformedEmployeeDetail extends EmployeeDetail {
  user: EmployeeDetail["user"] & {
    full_name: string;
  };
  employmentStatusLabel: string;
  departmentLabel: string | null;
  employmentTypeLabel: string | null;
  employmentLevelLabel: string | null;
  genderLabel: string | null;
  maritalStatusLabel: string | null;
  documentTypeLabel: string | null;
  joiningDateFormatted: string;
  createdAtFormatted: string;
  updatedAtFormatted: string;
  separationInitiatedDateFormatted: string | null;
  lastWorkingDayFormatted: string | null;
  showSeparationFields: boolean;
}

/**
 * Transform a single employee summary for display
 */
export function transformEmployeeSummary(
  employee: EmployeeSummary
): TransformedEmployeeSummary {
  return {
    ...employee,
    user: {
      ...employee.user,
      full_name: getUserFullName(
        employee.user.first_name,
        employee.user.last_name
      ),
    },
    job_title: employee.job_title || "—",
    department: employee.department || "—",
    departmentLabel: getDepartmentLabel(employee.department),
    employmentStatusLabel: getEmploymentStatusLabel(employee.employment_status),
    statusBadge: employee.is_active ? "active" : "inactive",
    joiningDateFormatted: formatDate(employee.joining_date),
    createdAtFormatted: formatDateTime(employee.created_at),
    updatedAtFormatted: formatDateTime(employee.updated_at),
  };
}

/**
 * Transform a single employee detail for display
 */
export function transformEmployeeDetail(
  employee: EmployeeDetail
): TransformedEmployeeDetail {
  const showSeparationFields =
    employee.employment_status === "RESIGNED" ||
    employee.employment_status === "TERMINATED";

  return {
    ...employee,
    user: {
      ...employee.user,
      full_name: getUserFullName(
        employee.user.first_name,
        employee.user.last_name
      ),
    },
    employmentStatusLabel: getEmploymentStatusLabel(employee.employment_status),
    departmentLabel: employee.department
      ? getDepartmentLabel(employee.department)
      : null,
    employmentTypeLabel: employee.employment_type
      ? getEmploymentTypeLabel(employee.employment_type)
      : null,
    employmentLevelLabel: employee.employment_level
      ? getEmploymentLevelLabel(employee.employment_level)
      : null,
    genderLabel: employee.gender ? getGenderLabel(employee.gender) : null,
    maritalStatusLabel: employee.marital_status
      ? getMaritalStatusLabel(employee.marital_status)
      : null,
    documentTypeLabel: employee.document_type
      ? getDocumentTypeLabel(employee.document_type)
      : null,
    joiningDateFormatted: formatDate(employee.joining_date),
    createdAtFormatted: formatDateTime(employee.created_at),
    updatedAtFormatted: formatDateTime(employee.updated_at),
    separationInitiatedDateFormatted: formatDate(
      employee.separation_initiated_date
    ),
    lastWorkingDayFormatted: formatDate(employee.last_working_day),
    showSeparationFields,
  };
}

/**
 * Hook for transforming employee summaries
 * @param employees - Array of employee summaries
 * @returns Transformed employee summaries
 */
export function useEmployeeTransformations(
  employees: EmployeeSummary[]
): TransformedEmployeeSummary[] {
  return useMemo(() => {
    return employees.map(transformEmployeeSummary);
  }, [employees]);
}


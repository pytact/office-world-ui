// utils/types/requests/employee.ts

// ENUM Type Definitions
export type EmploymentStatus =
  | "TRAINEE"
  | "PROBATION"
  | "CONFIRMED"
  | "NOTICE_PERIOD"
  | "ACTIVE"
  | "ON_HOLD"
  | "TERMINATED"
  | "RESIGNED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "FREELANCE"
  | "TEMPORARY";

export type EmploymentLevel =
  | "INTERN"
  | "JUNIOR"
  | "MID"
  | "SENIOR"
  | "LEAD"
  | "MANAGER";

export type Department =
  | "FRONTEND"
  | "BACKEND"
  | "FULLSTACK"
  | "QA"
  | "HR"
  | "DEVOPS"
  | "UIUX"
  | "PRODUCT"
  | "MARKETING"
  | "DATA"
  | "SUPPORT";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type MaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "SEPARATED";

export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type DocumentType =
  | "AADHAAR"
  | "PAN"
  | "DL"
  | "VOTER_ID"
  | "PASSPORT";

export type SortOrder = "asc" | "desc";

export type EmployeeSortBy =
  | "created_at"
  | "updated_at"
  | "joining_date"
  | "job_title"
  | "department"
  | "employment_status";

// Base Interface
export interface EmployeeBase {
  job_title?: string | null;
  department?: Department | null;
  employment_type?: EmploymentType | null;
  employment_level?: EmploymentLevel | null;
  work_email?: string | null;
  gender?: Gender | null;
  marital_status?: MaritalStatus | null;
  blood_group?: BloodGroup | null;
  nationality?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  document_type?: DocumentType | null;
  document_number?: string | null;
  separation_initiated_date?: string | null; // ISO 8601 date format (YYYY-MM-DD)
  separation_reason?: string | null;
  last_working_day?: string | null; // ISO 8601 date format (YYYY-MM-DD)
  notice_period_days?: number | null;
  is_active?: boolean | null;
}

// Update Interface (all fields optional for partial update)
export interface EmployeeUpdate {
  employment_status?: EmploymentStatus | null;
  job_title?: string | null;
  department?: Department | null;
  employment_type?: EmploymentType | null;
  employment_level?: EmploymentLevel | null;
  work_email?: string | null;
  gender?: Gender | null;
  marital_status?: MaritalStatus | null;
  blood_group?: BloodGroup | null;
  nationality?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  document_type?: DocumentType | null;
  document_number?: string | null;
  separation_initiated_date?: string | null; // ISO 8601 date format (YYYY-MM-DD)
  separation_reason?: string | null;
  last_working_day?: string | null; // ISO 8601 date format (YYYY-MM-DD)
  notice_period_days?: number | null;
  is_active?: boolean | null;
}

// List Parameters Interface
export interface EmployeeListParams {
  page?: number; // Default: 1, minimum: 1
  page_size?: number; // Default: 20, range: 1-100
  search?: string | null; // Search by user name or email (case-insensitive partial match)
  department?: Department | null; // Filter by department (exact match)
  employment_status?: EmploymentStatus | null; // Filter by employment status (exact match)
  role_code?: string | null; // Filter by role code (e.g., "manager", "hr")
  sort_by?: EmployeeSortBy; // Default: "created_at"
  sort_order?: SortOrder; // Default: "desc"
}


// utils/types/response/employee.ts

import type {
  EmploymentStatus,
  EmploymentType,
  EmploymentLevel,
  Department,
  Gender,
  MaritalStatus,
  BloodGroup,
  DocumentType,
} from "../requests/employee";

// Nested User Object (used in Employee responses)
export interface UserSummary {
  user_id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
}

// Employee Summary (for list responses)
export interface EmployeeSummary {
  employee_id: string; // UUID
  user: UserSummary;
  job_title: string | null;
  department: Department | null;
  employment_status: EmploymentStatus;
  is_active: boolean;
  joining_date: string; // ISO 8601 date format (YYYY-MM-DD)
  created_at: string; // ISO 8601 datetime format (UTC)
  updated_at: string; // ISO 8601 datetime format (UTC)
}

// Employee Detail (for detail/create/update responses)
export interface EmployeeDetail {
  employee_id: string; // UUID
  user_id: string; // UUID
  company_id: string; // UUID
  joining_date: string; // ISO 8601 date format (YYYY-MM-DD)
  employment_status: EmploymentStatus;
  job_title: string | null;
  department: Department | null;
  employment_type: EmploymentType | null;
  employment_level: EmploymentLevel | null;
  work_email: string | null;
  gender: Gender | null;
  marital_status: MaritalStatus | null;
  blood_group: BloodGroup | null;
  nationality: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  document_type: DocumentType | null;
  document_number: string | null;
  separation_initiated_date: string | null; // ISO 8601 date format (YYYY-MM-DD)
  separation_reason: string | null;
  last_working_day: string | null; // ISO 8601 date format (YYYY-MM-DD)
  notice_period_days: number | null;
  is_active: boolean;
  is_deleted: boolean;
  user: UserSummary;
  can_edit_employee: boolean; // Derived field
  can_deactivate: boolean; // Derived field
  can_soft_delete: boolean; // Derived field
  created_at: string; // ISO 8601 datetime format (UTC)
  updated_at: string; // ISO 8601 datetime format (UTC)
  created_by: string | null; // UUID
  updated_by: string | null; // UUID
}

// Pagination Wrapper
export interface EmployeePaginatedResponse {
  items: EmployeeSummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null; // Full relative URL or null
  prev_page: string | null; // Full relative URL or null
}

// Standard API Response Wrapper (generic)
export interface StandardResponse<T> {
  data: T;
  message: string;
}

// List Response (GET /api/v1/company/employees)
export interface EmployeeListResponse
  extends StandardResponse<EmployeePaginatedResponse> {}

// Mutation Response (POST /api/v1/company/employees, PATCH /api/v1/company/employees/{id})
export interface EmployeeMutationResponse
  extends StandardResponse<EmployeeDetail> {}

// Detail Response (GET /api/v1/company/employees/{id})
export interface EmployeeDetailResponse
  extends StandardResponse<EmployeeDetail> {}

// Error Detail (for API error responses)
export interface ErrorDetail {
  field: string;
  issue: string;
}

// Error Response Structure
export interface APIErrorResponse {
  error: {
    code: string;
    details: ErrorDetail[];
  };
  message: string;
}


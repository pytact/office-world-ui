// Response types for F-004: Platform Company Management
// Following R3 rules: Entity Response, List Response, Mutation Response
// All field names match API spec exactly (snake_case, no renaming)

/**
 * Company entity response (full detail)
 * GET /api/v1/companies/{company_id}
 * POST /api/v1/companies
 * PATCH /api/v1/companies/{company_id}
 * Matches API response structure exactly
 */
export interface CompanyResponse {
  company_id: string;
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
  is_deleted: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

/**
 * Company summary response (list item)
 * Used in paginated list responses
 * GET /api/v1/companies (items array)
 * Reduced field set for list views
 */
export interface CompanySummary {
  company_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  is_deleted: boolean;
  user_count: number;
  created_at: string;
  updated_at: string;
}

/**
 * Company profile response (CEO/HR view)
 * GET /api/v1/company/profile
 * PATCH /api/v1/company/profile
 * Excludes governance fields (is_deleted, audit fields, user_count)
 * Note: name and slug are read-only (included for display)
 * Note: updated_at is included for ETag generation (concurrency control)
 */
export interface CompanyProfileResponse {
  name: string;
  slug: string;
  description: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean; // Read-only, for display only
  updated_at: string; // Required for ETag generation (concurrency control)
}

/**
 * Pagination metadata for company list responses
 * Matches API response structure exactly
 */
export interface CompanyListPaginationMeta {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * Company list response data structure
 * Contains items array and pagination metadata
 * GET /api/v1/companies
 */
export interface CompanyListData {
  items: CompanySummary[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  next_page: string | null;
  prev_page: string | null;
}

/**
 * GET /api/v1/companies
 * Company list response (SuperAdmin only)
 */
export interface CompanyListResponse {
  data: CompanyListData;
  message: string;
}

/**
 * GET /api/v1/companies/{company_id}
 * Single company detail response (SuperAdmin only)
 */
export interface CompanyDetailResponse {
  data: CompanyResponse;
  message: string;
}

/**
 * POST /api/v1/companies
 * Mutation response for company creation
 */
export interface CompanyCreateMutationResponse {
  data: CompanyResponse;
  message: string;
}

/**
 * PATCH /api/v1/companies/{company_id}
 * Mutation response for company update (SuperAdmin only)
 */
export interface CompanyUpdateMutationResponse {
  data: CompanyResponse;
  message: string;
}

/**
 * GET /api/v1/company/profile
 * Company profile detail response (CEO/HR only)
 */
export interface CompanyProfileDetailResponse {
  data: CompanyProfileResponse;
  message: string;
}

/**
 * PATCH /api/v1/company/profile
 * Mutation response for company profile update (CEO/HR only)
 */
export interface CompanyProfileUpdateMutationResponse {
  data: CompanyProfileResponse;
  message: string;
}


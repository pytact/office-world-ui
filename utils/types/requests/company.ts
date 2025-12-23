// Request types for F-004: Platform Company Management
// Following R2 rules: Base, Create, Update, ListParams patterns

/**
 * Base company request interface
 * Common fields shared across company operations
 */
export interface CompanyBase {
  name: string;
  slug: string;
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  website?: string | null;
  logo_url?: string | null;
}

/**
 * POST /api/v1/companies
 * Request body for creating a new company
 * Required fields: name, slug
 * Optional fields: description, address, city, state, country, postal_code, website, logo_url
 * Note: is_active defaults to true on creation (server-side)
 */
export interface CompanyCreate extends CompanyBase {
  name: string; // Required
  slug: string; // Required
}

/**
 * PATCH /api/v1/companies/{company_id}
 * Request body for updating company information or activating/deactivating (SuperAdmin only)
 * All fields are optional - only include fields to update
 * Note: name and slug are immutable and cannot be updated
 */
export interface CompanyUpdate {
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  website?: string | null;
  logo_url?: string | null;
  is_active?: boolean; // For activate/deactivate operations
  is_deleted?: boolean; // For soft delete/restore operations
}

/**
 * PATCH /api/v1/company/profile
 * Request body for updating company profile fields (CEO/HR only, non-governance fields)
 * All fields are optional - only include fields to update
 * Note: name and slug are immutable and cannot be updated
 * Note: is_active and is_deleted are governance fields and cannot be updated via this endpoint
 * Note: Updates are blocked when company is inactive (is_active: false)
 */
export interface CompanyProfileUpdate {
  description?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  postal_code?: string | null;
  website?: string | null;
  logo_url?: string | null;
}

/**
 * GET /api/v1/companies
 * Query parameters for listing companies with pagination, search, filtering, and sorting (SuperAdmin only)
 * Note: page and page_size have defaults (page: 1, page_size: 20) but are included in query
 */
export interface CompanyListParams {
  page?: number; // Default: 1, minimum: 1
  page_size?: number; // Default: 20, range: 1-100
  search?: string | null; // Search by company name or slug (case-insensitive partial match)
  status?: "active" | "inactive" | "deleted" | null; // Filter by status
  sort_by?: string; // Sort field: created_at, updated_at, name, slug, is_active (default: created_at)
  sort_order?: "asc" | "desc"; // Sort order (default: desc)
}


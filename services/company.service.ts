// Company Service
// F-004: Platform Company Management
// Following R8 rules: API Calls & Error Handling

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";
import { buildIfMatchHeaders } from "@/utils/helpers/etag";

import {
  CompanyCreate,
  CompanyUpdate,
  CompanyProfileUpdate,
  CompanyListParams,
} from "@/utils/types/requests/company";

import {
  CompanyListResponse,
  CompanyDetailResponse,
  CompanyCreateMutationResponse,
  CompanyUpdateMutationResponse,
  CompanyProfileDetailResponse,
  CompanyProfileUpdateMutationResponse,
} from "@/utils/types/responses/company";

const basePath = "/v1";

export const CompanyService = {
  /**
   * GET /api/v1/companies
   * List all companies with pagination, search, filtering, and sorting (SuperAdmin only)
   */
  list: async (params?: CompanyListParams): Promise<CompanyListResponse> => {
    try {
      const searchParams = new URLSearchParams();

      if (params?.page !== undefined) {
        searchParams.append("page", params.page.toString());
      }
      if (params?.page_size !== undefined) {
        searchParams.append("page_size", params.page_size.toString());
      }
      if (params?.search) {
        searchParams.append("search", params.search);
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      if (params?.sort_by) {
        searchParams.append("sort_by", params.sort_by);
      }
      if (params?.sort_order) {
        searchParams.append("sort_order", params.sort_order);
      }

      const queryString = searchParams.toString();
      const url = `${basePath}/companies${queryString ? `?${queryString}` : ""}`;

      const r = await http.get<CompanyListResponse>(url);
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/companies/{company_id}
   * Get company details with user count (SuperAdmin only)
   */
  getById: async (company_id: string): Promise<CompanyDetailResponse> => {
    try {
      const r = await http.get<CompanyDetailResponse>(
        `${basePath}/companies/${company_id}`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/companies
   * Create a new company (SuperAdmin only)
   */
  create: async (
    payload: CompanyCreate
  ): Promise<CompanyCreateMutationResponse> => {
    try {
      const r = await http.post<CompanyCreateMutationResponse>(
        `${basePath}/companies`,
        payload
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/companies/{company_id}
   * Update company information or activate/deactivate (SuperAdmin only)
   * Note: Requires If-Match header with ETag for concurrency control
   */
  update: async (
    company_id: string,
    payload: CompanyUpdate,
    etag?: string
  ): Promise<CompanyUpdateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<CompanyUpdateMutationResponse>(
        `${basePath}/companies/${company_id}`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * DELETE /api/v1/companies/{company_id}
   * Hard delete a company (irreversible, SuperAdmin only)
   * Note: Requires If-Match header with ETag for concurrency control
   * Returns 204 No Content on success
   */
  delete: async (company_id: string, etag?: string): Promise<void> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      await http.delete(`${basePath}/companies/${company_id}`, {
        headers,
      });
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/company/profile
   * Get own company profile (CEO/HR only, non-governance fields)
   */
  getProfile: async (): Promise<CompanyProfileDetailResponse> => {
    try {
      const r = await http.get<CompanyProfileDetailResponse>(
        `${basePath}/company/profile`
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * PATCH /api/v1/company/profile
   * Update company profile fields (CEO/HR only, non-governance fields)
   * Note: Requires If-Match header with ETag for concurrency control
   * Note: Updates are blocked when company is inactive (is_active: false)
   */
  updateProfile: async (
    payload: CompanyProfileUpdate,
    etag?: string
  ): Promise<CompanyProfileUpdateMutationResponse> => {
    try {
      const headers = buildIfMatchHeaders(etag);

      const r = await http.patch<CompanyProfileUpdateMutationResponse>(
        `${basePath}/company/profile`,
        payload,
        { headers }
      );
      return r.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


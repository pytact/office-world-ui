// Common response types shared across all resources

/**
 * Standard API error response structure
 * Matches API spec error format exactly
 */
export interface ErrorDetail {
  field?: string;
  issue?: string;
}

export interface APIErrorResponse {
  error: {
    code: string;
    details: ErrorDetail[];
  };
  message: string;
}

/**
 * Standard API success response wrapper
 * Used for responses that don't have specific data structure
 */
export interface ApiSuccessResponse<T = unknown> {
  data: T;
  message: string;
}

/**
 * Standard pagination metadata
 * Used in all list responses
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Standard list response structure
 * Generic template for paginated list responses
 */
export interface ListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Standard mutation response structure
 * Generic template for create/update/delete operations
 */
export interface MutationResponse<T> {
  message: string;
  data: T | null;
}


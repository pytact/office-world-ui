// ETag Utility Functions
// Global utilities for handling ETags in CRUD operations
// Provides consistent ETag extraction and If-Match header building
// Following F-004 API spec: ETag format is based on updated_at timestamp (e.g., "20240120T103000Z")

import { AxiosResponse, AxiosResponseHeaders } from "axios";

type HeadersLike = 
  | Record<string, string | string[] | undefined>
  | AxiosResponseHeaders
  | Record<string, any>
  | undefined;

/**
 * Converts updated_at timestamp to ETag format
 * ETag format: "20240120T103000Z" (ISO 8601 without separators)
 * @param updatedAt - ISO 8601 timestamp string (e.g., "2024-01-20T10:30:00Z")
 * @returns ETag formatted string (e.g., "20240120T103000Z") or null if invalid
 */
export function convertUpdatedAtToETag(updatedAt: string | null | undefined): string | null {
  if (!updatedAt) {
    return null;
  }

  try {
    // Parse the ISO 8601 timestamp
    const date = new Date(updatedAt);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }

    // Format: YYYYMMDDTHHMMSSZ
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  } catch (error) {
    return null;
  }
}

/**
 * Extracts ETag from response data's updated_at field
 * This is the primary method for F-004 API (ETag based on updated_at)
 * @param data - Response data object with updated_at field
 * @returns ETag value or null if not found
 */
export function extractETagFromUpdatedAt(
  data: { updated_at?: string | null } | null | undefined
): string | null {
  if (!data || !data.updated_at) {
    return null;
  }

  return convertUpdatedAtToETag(data.updated_at);
}

/**
 * Extracts ETag from response headers
 * Handles both standard and weak ETags (W/"...")
 * Supports Axios response objects, headers objects, or data objects with _headers property
 * @param response - Axios response object, headers object, or data object with _headers
 * @returns ETag value or null if not found
 */
export function extractETag(
  response: 
    | AxiosResponse 
    | { headers?: HeadersLike }
    | { _headers?: HeadersLike }
    | any // Allow any object (data objects with _headers attached by HTTP client)
    | null
    | undefined
): string | null {
  if (!response) {
    return null;
  }

  // Handle data objects with _headers property (attached by HTTP client)
  let headers: HeadersLike;
  if ("_headers" in response && response._headers) {
    headers = response._headers;
  } else if ("headers" in response) {
    headers = response.headers;
  } else {
    return null;
  }
  
  if (!headers) {
    return null;
  }

  // ETag can be in 'etag' (lowercase) or 'ETag' (case-insensitive)
  // Axios normalizes headers to lowercase, so check both
  // Handle different header types
  let etagHeader: string | string[] | null | undefined;
  
  if (typeof headers === "object" && headers !== null) {
    // Try lowercase first (Axios normalizes to lowercase)
    etagHeader = (headers as any)["etag"] || (headers as any)["ETag"];
    
    // If it's an AxiosHeaders-like object with get method
    if (!etagHeader && typeof (headers as any).get === "function") {
      try {
        etagHeader = (headers as any).get("etag");
      } catch {
        // Ignore if get method fails
      }
    }
  }

  if (!etagHeader) {
    return null;
  }

  // Handle array of headers (Axios can return arrays)
  const etagValue = Array.isArray(etagHeader) ? etagHeader[0] : etagHeader;

  if (!etagValue || typeof etagValue !== "string") {
    return null;
  }

  // Remove quotes and weak ETag prefix if present
  // ETag format: "value" or W/"value"
  const cleaned = etagValue.replace(/^W\/"/, "").replace(/^"/, "").replace(/"$/, "");

  return cleaned || null;
}

/**
 * Builds headers object with If-Match header for concurrency control
 * @param etag - ETag value to include in If-Match header
 * @param existingHeaders - Optional existing headers to merge with
 * @returns Headers object with If-Match header
 */
export function buildIfMatchHeaders(
  etag: string | null | undefined,
  existingHeaders?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = { ...existingHeaders };

  if (etag) {
    headers["If-Match"] = etag;
  }

  return headers;
}

/**
 * Extracts ETag from response and builds If-Match headers
 * Convenience function that combines extractETag and buildIfMatchHeaders
 * @param response - Axios response object, headers object, or data object with _headers
 * @param existingHeaders - Optional existing headers to merge with
 * @returns Headers object with If-Match header if ETag was found
 */
export function extractAndBuildHeaders(
  response: 
    | AxiosResponse 
    | { headers?: HeadersLike }
    | { _headers?: HeadersLike }
    | null
    | undefined,
  existingHeaders?: Record<string, string>
): Record<string, string> {
  const etag = extractETag(response);
  return buildIfMatchHeaders(etag, existingHeaders);
}


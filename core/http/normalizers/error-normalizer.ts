// Error Normalizer
// Centralized error normalization following R8 rules
// Includes network error handling (R15 Issue 11)

import { AxiosError } from "axios";
import { APIErrorResponse } from "@/utils/types/responses/common";

export interface NormalizedError {
  message: string;
  statusCode: number;
  error?: {
    code: string;
    details: Array<{ field?: string; issue?: string }>;
  };
  fieldErrors?: Record<string, string>;
  isNetworkError?: boolean;
}

export function normalizeAPIError(error: unknown): NormalizedError {
  if (error instanceof AxiosError) {
    // Handle network errors (CORS, connection issues) - R15 Issue 11
    if (!error.response && error.request) {
      // Check for various network error codes and messages
      const isNetworkError =
        error.code === "ERR_NETWORK" ||
        error.code === "ERR_INTERNET_DISCONNECTED" ||
        error.code === "ERR_CONNECTION_REFUSED" ||
        error.message.includes("Network Error") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("CORS");

      if (isNetworkError) {
        return {
          message:
            "Network Error: Unable to connect to the server. Please check if the API server is running and CORS is configured correctly.",
          statusCode: 0,
          isNetworkError: true,
        };
      }

      // Handle CORS errors specifically
      if (
        error.message.includes("CORS") ||
        error.message.includes("Access-Control-Allow-Origin")
      ) {
        return {
          message:
            "CORS Error: The server is blocking requests from this origin. Please check backend CORS configuration.",
          statusCode: 0,
          isNetworkError: true,
        };
      }
    }

    const response = error.response;
    const errorData = response?.data as APIErrorResponse | undefined;

    return {
      message: errorData?.message || error.message || "Unknown error occurred",
      statusCode: response?.status || 500,
      error: errorData?.error
        ? {
            code: errorData.error.code,
            details: errorData.error.details || [],
          }
        : undefined,
      fieldErrors: extractFieldErrors(errorData),
      isNetworkError: false,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message || "Unknown error occurred",
      statusCode: 500,
      isNetworkError: false,
    };
  }

  return {
    message: "Unknown error occurred",
    statusCode: 500,
    isNetworkError: false,
  };
}

function extractFieldErrors(
  errorData: APIErrorResponse | undefined
): Record<string, string> | undefined {
  if (!errorData?.error?.details) {
    return undefined;
  }

  const fieldErrors: Record<string, string> = {};

  errorData.error.details.forEach((detail) => {
    if (detail.field && detail.issue) {
      fieldErrors[detail.field] = detail.issue;
    }
  });

  return Object.keys(fieldErrors).length > 0 ? fieldErrors : undefined;
}


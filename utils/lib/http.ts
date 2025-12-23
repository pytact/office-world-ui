// HTTP Client Instance
// Exported configured client for use in services

import { createHttpClient } from "./httpClient";

// Remove trailing slash to avoid double slashes in URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

if (!API_BASE_URL) {
  console.warn("NEXT_PUBLIC_BASE_URL is not set in environment variables");
} else {
  // Log in development to help debug
  if (process.env.NODE_ENV === "development") {
    console.log("API Base URL:", API_BASE_URL);
  }
}

export const http = createHttpClient(API_BASE_URL);


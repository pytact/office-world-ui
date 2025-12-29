// HTTP Client Instance
// Exported configured client for use in services

import { createHttpClient } from "./httpClient";

// Remove trailing slash to avoid double slashes in URLs
const API_BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");

// API Base URL validation is handled by the HTTP client

export const http = createHttpClient(API_BASE_URL);


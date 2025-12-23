// HTTP Client Factory
// Creates configured Axios instances with interceptors

import axios, { AxiosInstance, AxiosError } from "axios";

export function createHttpClient(apiBaseUrl: string): AxiosInstance {
  const instance = axios.create({
    baseURL: apiBaseUrl,
    headers: { "Content-Type": "application/json" },
  });

  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("access_token");
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => {
      // Log successful responses in development
      if (process.env.NODE_ENV === "development") {
        console.log(`[HTTP] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          contentType: response.headers["content-type"],
          dataType: typeof response.data,
          data: response.data,
          isString: typeof response.data === "string",
          stringLength: typeof response.data === "string" ? response.data.length : 0,
        });
      }
      
      // Handle case where response.data might be a string that needs parsing
      if (typeof response.data === "string" && response.data.length > 0) {
        try {
          const parsed = JSON.parse(response.data);
          if (process.env.NODE_ENV === "development") {
            console.log("[HTTP] Parsed string response to JSON:", parsed);
          }
          response.data = parsed;
        } catch (e) {
          // If parsing fails, keep original data
          if (process.env.NODE_ENV === "development") {
            console.warn("[HTTP] Failed to parse response string as JSON:", e);
          }
        }
      }
      
      // Verify response has data
      if (response.data === undefined || response.data === null) {
        console.warn("[HTTP] Response has no data:", response);
      }
      
      // Attach headers to response.data as a non-enumerable property for ETag access
      // This allows services to continue returning r.data while hooks can access headers
      if (response.data && typeof response.data === "object") {
        Object.defineProperty(response.data, "_headers", {
          value: response.headers,
          enumerable: false,
          writable: false,
          configurable: false,
        });
      }
      
      return response;
    },
    (error: AxiosError) => {
      // Enhanced error logging for debugging
      if (process.env.NODE_ENV === "development") {
        console.error("[HTTP Error]", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
          code: error.code,
          request: error.request,
        });
      }
      return Promise.reject(error);
    }
  );

  return instance;
}


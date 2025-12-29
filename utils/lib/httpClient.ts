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
      // Handle case where response.data might be a string that needs parsing
      if (typeof response.data === "string" && response.data.length > 0) {
        try {
          const parsed = JSON.parse(response.data);
          response.data = parsed;
        } catch (e) {
          // If parsing fails, keep original data
        }
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
      return Promise.reject(error);
    }
  );

  return instance;
}


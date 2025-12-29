// Auth Service
// F-000: Core Platform Foundation - Authentication

import { http } from "@/utils/lib/http";
import { normalizeAPIError } from "@/core/http/normalizers/error-normalizer";

import {
  LoginRequest,
  ActivationRequest,
  RequestPasswordResetRequest,
  SubmitPasswordResetRequest,
} from "@/utils/types/requests/auth";

import {
  LoginResponse,
  LogoutResponse,
  ActivationValidationResponse,
  ActivationResponse,
  RequestPasswordResetResponse,
  SubmitPasswordResetResponse,
  MeResponse,
} from "@/utils/types/responses/auth";

const basePath = "/v1/auth";

export const AuthService = {
  /**
   * POST /api/v1/auth/login
   * Authenticate user and return JWT token
   */
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await http.post<LoginResponse>(`${basePath}/login`, payload);
      
      // Verify response structure
      if (!response.data) {
        throw new Error("Invalid response format: missing data field");
      }
      
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/auth/logout
   * Invalidate user session
   */
  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await http.post<LogoutResponse>(`${basePath}/logout`);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/auth/invitation/{token}
   * Validate invitation token
   */
  validateActivationToken: async (token: string): Promise<ActivationValidationResponse> => {
    try {
      const response = await http.get<ActivationValidationResponse>(
        `${basePath}/invitations/${token}`
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/auth/activation/{token}
   * Activate user account
   */
  activate: async (
    token: string,
    payload: ActivationRequest
  ): Promise<ActivationResponse> => {
    try {
      const response = await http.post<ActivationResponse>(
        `${basePath}/activation/${token}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/auth/password-reset/request
   * Request password reset
   */
  requestPasswordReset: async (
    payload: RequestPasswordResetRequest
  ): Promise<RequestPasswordResetResponse> => {
    try {
      const response = await http.post<RequestPasswordResetResponse>(
        `${basePath}/password-reset/request`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * POST /api/v1/auth/password-reset/{token}
   * Reset password with token
   */
  submitPasswordReset: async (
    token: string,
    payload: SubmitPasswordResetRequest
  ): Promise<SubmitPasswordResetResponse> => {
    try {
      const response = await http.post<SubmitPasswordResetResponse>(
        `${basePath}/password-reset/${token}`,
        payload
      );
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },

  /**
   * GET /api/v1/auth/me
   * Get current authenticated user's profile information, permissions, and context
   */
  getMe: async (): Promise<MeResponse> => {
    try {
      const response = await http.get<MeResponse>(`${basePath}/me`);
      return response.data;
    } catch (error) {
      throw normalizeAPIError(error);
    }
  },
};


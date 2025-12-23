// Response types for F-000: Core Platform Foundation - Authentication

/**
 * POST /api/v1/auth/login
 * Response data structure
 */
export interface LoginUserData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  org_id: string | null;
  company_slug: string | null;
  company_is_active: boolean | null;
  is_super_admin: boolean;
}

export interface LoginResponseData {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: LoginUserData;
}

export interface LoginResponse {
  data: LoginResponseData;
  message: string;
}

/**
 * POST /api/v1/auth/logout
 * Response structure
 */
export interface LogoutResponse {
  data: null;
  message: string;
}

/**
 * GET /api/v1/auth/activation/{token}
 * Response data structure for activation token validation
 */
export interface ActivationValidationResponseData {
  email: string;
  company_name: string;
  role: string;
  invitation_status: string;
  expires_at: string;
}

export interface ActivationValidationResponse {
  data: ActivationValidationResponseData;
  message: string;
}

/**
 * POST /api/v1/auth/activation/{token}
 * Response data structure for account activation
 */
export interface ActivationResponseData {
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  org_id: string;
  activated_at: string;
}

export interface ActivationResponse {
  data: ActivationResponseData;
  message: string;
}

/**
 * POST /api/v1/auth/password-reset/request
 * Response data structure
 */
export interface RequestPasswordResetResponseData {
  email: string;
  reset_requested: boolean;
}

export interface RequestPasswordResetResponse {
  data: RequestPasswordResetResponseData;
  message: string;
}

/**
 * POST /api/v1/auth/password-reset/{token}
 * Response data structure
 */
export interface SubmitPasswordResetResponseData {
  email: string;
  password_reset: boolean;
  reset_at: string;
}

export interface SubmitPasswordResetResponse {
  data: SubmitPasswordResetResponseData;
  message: string;
}


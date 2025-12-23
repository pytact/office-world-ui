// Request types for F-000: Core Platform Foundation - Authentication

/**
 * POST /api/v1/auth/login
 * Request body for user login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * POST /api/v1/auth/activation/{token}
 * Request body for user account activation
 */
export interface ActivationRequest {
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

/**
 * POST /api/v1/auth/password-reset/request
 * Request body for password reset request (sends email with reset token)
 */
export interface RequestPasswordResetRequest {
  email: string;
}

/**
 * POST /api/v1/auth/password-reset/{token}
 * Request body for password reset with token (submits new password)
 */
export interface SubmitPasswordResetRequest {
  password: string;
  password_confirm: string;
}


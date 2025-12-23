// User Form Hook
// Encapsulates form state management for user operations
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import {
  UserInviteCreate,
  UserUpdate,
  UserRoleChange,
} from "@/utils/types/requests/user";

interface UseUserInviteFormParams {
  initialEmail?: string;
  initialRoleCode?: string;
  initialCompanySlug?: string | null;
}

interface UseUserInviteFormReturn {
  email: string;
  roleCode: string;
  companySlug: string | null;
  setEmail: (value: string) => void;
  setRoleCode: (value: string) => void;
  setCompanySlug: (value: string | null) => void;
  reset: () => void;
  getPayload: () => UserInviteCreate;
  isValid: boolean;
  errors: Record<string, string>;
}

interface UseUserUpdateFormParams {
  initialFirstName?: string | null;
  initialLastName?: string | null;
}

interface UseUserUpdateFormReturn {
  firstName: string;
  lastName: string;
  setFirstName: (value: string) => void;
  setLastName: (value: string) => void;
  reset: () => void;
  getPayload: () => UserUpdate;
  isValid: boolean;
  hasChanges: boolean;
  errors: Record<string, string>;
}

interface UseUserRoleFormParams {
  initialRoleCode?: string;
}

interface UseUserRoleFormReturn {
  roleCode: string;
  setRoleCode: (value: string) => void;
  reset: () => void;
  getPayload: () => UserRoleChange;
  isValid: boolean;
}

/**
 * Hook for managing user invitation form state
 * Encapsulates form validation and payload transformation
 * @param params - Initial form values
 * @returns Form state, handlers, validation, and payload
 */
export function useUserInviteForm(
  params?: UseUserInviteFormParams
): UseUserInviteFormReturn {
  const [email, setEmail] = useState(params?.initialEmail || "");
  const [roleCode, setRoleCode] = useState(params?.initialRoleCode || "");
  const [companySlug, setCompanySlug] = useState<string | null>(
    params?.initialCompanySlug ?? null
  );

  const reset = useCallback(() => {
    setEmail("");
    setRoleCode("");
    setCompanySlug(null);
  }, []);

  const getPayload = useCallback((): UserInviteCreate => {
    return {
      email: email.trim(),
      role_code: roleCode,
      company_slug: companySlug || undefined,
    };
  }, [email, roleCode, companySlug]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Invalid email format";
    } else if (email.trim().length > 254) {
      errs.email = "Email must be 254 characters or less";
    }

    if (!roleCode) {
      errs.roleCode = "Role is required";
    }

    return errs;
  }, [email, roleCode]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && !!email.trim() && !!roleCode;
  }, [errors, email, roleCode]);

  return {
    email,
    roleCode,
    companySlug,
    setEmail,
    setRoleCode,
    setCompanySlug,
    reset,
    getPayload,
    isValid,
    errors,
  };
}

/**
 * Hook for managing user update form state (name changes)
 * Encapsulates form validation and change tracking
 * @param params - Initial form values
 * @returns Form state, handlers, validation, and payload
 */
export function useUserUpdateForm(
  params?: UseUserUpdateFormParams
): UseUserUpdateFormReturn {
  const [firstName, setFirstName] = useState(params?.initialFirstName || "");
  const [lastName, setLastName] = useState(params?.initialLastName || "");

  const reset = useCallback(() => {
    setFirstName(params?.initialFirstName || "");
    setLastName(params?.initialLastName || "");
  }, [params?.initialFirstName, params?.initialLastName]);

  const getPayload = useCallback((): UserUpdate => {
    const payload: UserUpdate = {};
    if (firstName.trim()) payload.first_name = firstName.trim();
    if (lastName.trim()) payload.last_name = lastName.trim();
    return payload;
  }, [firstName, lastName]);

  const hasChanges = useMemo(() => {
    return (
      firstName.trim() !== (params?.initialFirstName || "") ||
      lastName.trim() !== (params?.initialLastName || "")
    );
  }, [firstName, lastName, params?.initialFirstName, params?.initialLastName]);

  const errors = useMemo(() => {
    const errs: Record<string, string> = {};
    
    if (firstName.trim() && firstName.trim().length > 255) {
      errs.firstName = "First name must be 255 characters or less";
    }
    if (firstName.trim() && !/^[a-zA-Z0-9\s]+$/.test(firstName.trim())) {
      errs.firstName = "First name can only contain alphanumeric characters and spaces";
    }

    if (lastName.trim() && lastName.trim().length > 255) {
      errs.lastName = "Last name must be 255 characters or less";
    }
    if (lastName.trim() && !/^[a-zA-Z0-9\s]+$/.test(lastName.trim())) {
      errs.lastName = "Last name can only contain alphanumeric characters and spaces";
    }

    if (!firstName.trim() && !lastName.trim()) {
      errs.general = "At least one field (first name or last name) must be provided";
    }

    return errs;
  }, [firstName, lastName]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && (!!firstName.trim() || !!lastName.trim());
  }, [errors, firstName, lastName]);

  return {
    firstName,
    lastName,
    setFirstName,
    setLastName,
    reset,
    getPayload,
    isValid,
    hasChanges,
    errors,
  };
}

/**
 * Hook for managing user role change form state
 * Encapsulates role selection and validation
 * @param params - Initial role code
 * @returns Form state, handlers, validation, and payload
 */
export function useUserRoleForm(
  params?: UseUserRoleFormParams
): UseUserRoleFormReturn {
  const [roleCode, setRoleCode] = useState(params?.initialRoleCode || "");

  const reset = useCallback(() => {
    setRoleCode(params?.initialRoleCode || "");
  }, [params?.initialRoleCode]);

  const getPayload = useCallback((): UserRoleChange => {
    return {
      role_code: roleCode,
    };
  }, [roleCode]);

  const isValid = useMemo(() => {
    return !!roleCode;
  }, [roleCode]);

  return {
    roleCode,
    setRoleCode,
    reset,
    getPayload,
    isValid,
  };
}

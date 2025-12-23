// Company Profile Form Hook
// Encapsulates form state management and payload transformation for CEO/HR profile updates
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { CompanyProfileUpdate } from "@/utils/types/requests/company";
import { CompanyProfileResponse } from "@/utils/types/responses/company";

interface UseCompanyProfileFormParams {
  initialDescription?: string | null;
  initialAddress?: string | null;
  initialCity?: string | null;
  initialState?: string | null;
  initialCountry?: string | null;
  initialPostalCode?: string | null;
  initialWebsite?: string | null;
  initialLogoUrl?: string | null;
  isActive?: boolean; // Used to determine if form is editable
}

interface UseCompanyProfileFormReturn {
  // Form fields (only editable fields)
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  logoUrl: string;

  // Setters
  setDescription: (description: string) => void;
  setAddress: (address: string) => void;
  setCity: (city: string) => void;
  setState: (state: string) => void;
  setCountry: (country: string) => void;
  setPostalCode: (postalCode: string) => void;
  setWebsite: (website: string) => void;
  setLogoUrl: (logoUrl: string) => void;

  // Actions
  reset: () => void;
  resetToDefaults: (defaults: Partial<CompanyProfileResponse>) => void;

  // Payload generation
  getPayload: () => CompanyProfileUpdate;

  // Validation
  errors: Record<string, string>;
  isValid: boolean;
  isEditable: boolean;
  hasChanges: boolean;
  originalData: Partial<CompanyProfileResponse> | null;
}

/**
 * Hook for managing company profile form state (CEO/HR only)
 * Encapsulates form logic, validation, and payload transformation
 * Note: Updates are blocked when company is inactive (is_active: false)
 * @param params - Initial form values and company active status
 * @returns Form state, handlers, validation, and payload generator
 */
export function useCompanyProfileForm(
  params?: UseCompanyProfileFormParams
): UseCompanyProfileFormReturn {
  const [description, setDescription] = useState(
    params?.initialDescription || ""
  );
  const [address, setAddress] = useState(params?.initialAddress || "");
  const [city, setCity] = useState(params?.initialCity || "");
  const [state, setState] = useState(params?.initialState || "");
  const [country, setCountry] = useState(params?.initialCountry || "");
  const [postalCode, setPostalCode] = useState(params?.initialPostalCode || "");
  const [website, setWebsite] = useState(params?.initialWebsite || "");
  const [logoUrl, setLogoUrl] = useState(params?.initialLogoUrl || "");

  // Store original data for change detection
  const [originalData, setOriginalData] =
    useState<Partial<CompanyProfileResponse> | null>(null);

  const isActive = params?.isActive ?? true;
  const isEditable = isActive; // Can only edit when company is active

  const reset = useCallback(() => {
    setDescription("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPostalCode("");
    setWebsite("");
    setLogoUrl("");
    setOriginalData(null);
  }, []);

  const resetToDefaults = useCallback(
    (defaults: Partial<CompanyProfileResponse>) => {
      setDescription(defaults.description || "");
      setAddress(defaults.address || "");
      setCity(defaults.city || "");
      setState(defaults.state || "");
      setCountry(defaults.country || "");
      setPostalCode(defaults.postal_code || "");
      setWebsite(defaults.website || "");
      setLogoUrl(defaults.logo_url || "");
      setOriginalData(defaults);
    },
    []
  );

  // Check if form has changes
  const hasChanges = useMemo(() => {
    if (!originalData) return false;
    return (
      (description.trim() || null) !== originalData.description ||
      (address.trim() || null) !== originalData.address ||
      (city.trim() || null) !== originalData.city ||
      (state.trim() || null) !== originalData.state ||
      (country.trim() || null) !== originalData.country ||
      (postalCode.trim() || null) !== originalData.postal_code ||
      (website.trim() || null) !== originalData.website ||
      (logoUrl.trim() || null) !== originalData.logo_url
    );
  }, [
    description,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    logoUrl,
    originalData,
  ]);

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Description validation
    if (description.trim().length > 1000) {
      errs.description = "Description must be 1000 characters or less";
    }

    // Address validation
    if (address.trim().length > 255) {
      errs.address = "Address must be 255 characters or less";
    }

    // City validation
    if (city.trim().length > 100) {
      errs.city = "City must be 100 characters or less";
    }

    // State validation
    if (state.trim().length > 100) {
      errs.state = "State must be 100 characters or less";
    }

    // Country validation
    if (country.trim().length > 100) {
      errs.country = "Country must be 100 characters or less";
    }

    // Postal code validation
    if (postalCode.trim().length > 20) {
      errs.postalCode = "Postal code must be 20 characters or less";
    }

    // Website validation
    if (website.trim()) {
      try {
        const url = new URL(website.trim());
        if (url.protocol !== "https:") {
          errs.website = "Website must be a valid HTTPS URL";
        }
      } catch {
        errs.website = "Website must be a valid HTTPS URL";
      }
      if (website.trim().length > 2048) {
        errs.website = "Website URL must be 2048 characters or less";
      }
    }

    // Logo URL validation
    if (logoUrl.trim()) {
      try {
        const url = new URL(logoUrl.trim());
        if (url.protocol !== "https:") {
          errs.logoUrl = "Logo URL must be a valid HTTPS URL";
        }
      } catch {
        errs.logoUrl = "Logo URL must be a valid HTTPS URL";
      }
      if (logoUrl.trim().length > 2048) {
        errs.logoUrl = "Logo URL must be 2048 characters or less";
      }
    }

    return errs;
  }, [description, address, city, state, country, postalCode, website, logoUrl]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Transform empty strings to null for optional fields
  const toNullable = useCallback((value: string): string | null => {
    return value.trim() || null;
  }, []);

  // Only include changed fields in payload
  const getPayload = useCallback((): CompanyProfileUpdate => {
    const payload: CompanyProfileUpdate = {};

    if (originalData) {
      // Only include fields that have changed
      if ((description.trim() || null) !== originalData.description) {
        payload.description = toNullable(description);
      }
      if ((address.trim() || null) !== originalData.address) {
        payload.address = toNullable(address);
      }
      if ((city.trim() || null) !== originalData.city) {
        payload.city = toNullable(city);
      }
      if ((state.trim() || null) !== originalData.state) {
        payload.state = toNullable(state);
      }
      if ((country.trim() || null) !== originalData.country) {
        payload.country = toNullable(country);
      }
      if ((postalCode.trim() || null) !== originalData.postal_code) {
        payload.postal_code = toNullable(postalCode);
      }
      if ((website.trim() || null) !== originalData.website) {
        payload.website = toNullable(website);
      }
      if ((logoUrl.trim() || null) !== originalData.logo_url) {
        payload.logo_url = toNullable(logoUrl);
      }
    } else {
      // If no original data, include all fields
      payload.description = toNullable(description);
      payload.address = toNullable(address);
      payload.city = toNullable(city);
      payload.state = toNullable(state);
      payload.country = toNullable(country);
      payload.postal_code = toNullable(postalCode);
      payload.website = toNullable(website);
      payload.logo_url = toNullable(logoUrl);
    }

    return payload;
  }, [
    description,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    logoUrl,
    originalData,
    toNullable,
  ]);

  return {
    description,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    logoUrl,
    setDescription,
    setAddress,
    setCity,
    setState,
    setCountry,
    setPostalCode,
    setWebsite,
    setLogoUrl,
    reset,
    resetToDefaults,
    getPayload,
    errors,
    isValid,
    isEditable,
    hasChanges,
    originalData,
  };
}


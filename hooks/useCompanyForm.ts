// Company Form Hook
// Encapsulates form state management and payload transformation for company create/update
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import { CompanyCreate, CompanyUpdate } from "@/utils/types/requests/company";

interface UseCompanyFormParams {
  initialName?: string;
  initialSlug?: string;
  initialDescription?: string | null;
  initialAddress?: string | null;
  initialCity?: string | null;
  initialState?: string | null;
  initialCountry?: string | null;
  initialPostalCode?: string | null;
  initialWebsite?: string | null;
  initialLogoUrl?: string | null;
}

interface UseCompanyFormReturn {
  // Form fields
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  website: string;
  logoUrl: string;

  // Setters
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
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
  resetToDefaults: (defaults: UseCompanyFormParams) => void;

  // Payload generation
  getCreatePayload: () => CompanyCreate;
  getUpdatePayload: () => CompanyUpdate;

  // Validation
  errors: Record<string, string>;
  isValid: boolean;
  isCreateValid: boolean;
}

/**
 * Hook for managing company create/update form state
 * Encapsulates form logic, validation, and payload transformation
 * @param params - Initial form values
 * @returns Form state, handlers, validation, and payload generators
 */
export function useCompanyForm(
  params?: UseCompanyFormParams
): UseCompanyFormReturn {
  const [name, setName] = useState(params?.initialName || "");
  const [slug, setSlug] = useState(params?.initialSlug || "");
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

  const reset = useCallback(() => {
    setName("");
    setSlug("");
    setDescription("");
    setAddress("");
    setCity("");
    setState("");
    setCountry("");
    setPostalCode("");
    setWebsite("");
    setLogoUrl("");
  }, []);

  const resetToDefaults = useCallback((defaults: UseCompanyFormParams) => {
    setName(defaults.initialName || "");
    setSlug(defaults.initialSlug || "");
    setDescription(defaults.initialDescription || "");
    setAddress(defaults.initialAddress || "");
    setCity(defaults.initialCity || "");
    setState(defaults.initialState || "");
    setCountry(defaults.initialCountry || "");
    setPostalCode(defaults.initialPostalCode || "");
    setWebsite(defaults.initialWebsite || "");
    setLogoUrl(defaults.initialLogoUrl || "");
  }, []);

  // Validation
  const errors = useMemo(() => {
    const errs: Record<string, string> = {};

    // Name validation
    if (!name.trim()) {
      errs.name = "Company name is required";
    } else if (name.trim().length > 255) {
      errs.name = "Company name must be 255 characters or less";
    }

    // Slug validation
    if (!slug.trim()) {
      errs.slug = "Company slug is required";
    } else if (slug.trim().length < 3) {
      errs.slug = "Slug must be at least 3 characters";
    } else if (slug.trim().length > 100) {
      errs.slug = "Slug must be 100 characters or less";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.trim())) {
      errs.slug =
        "Slug must be lowercase alphanumeric with hyphens only (e.g., acme-corp)";
    }

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
  }, [name, slug, description, address, city, state, country, postalCode, website, logoUrl]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  const isCreateValid = useMemo(() => {
    return isValid && !!name.trim() && !!slug.trim();
  }, [isValid, name, slug]);

  // Transform empty strings to null for optional fields
  const toNullable = useCallback((value: string): string | null => {
    return value.trim() || null;
  }, []);

  const getCreatePayload = useCallback((): CompanyCreate => {
    return {
      name: name.trim(),
      slug: slug.trim(),
      description: toNullable(description),
      address: toNullable(address),
      city: toNullable(city),
      state: toNullable(state),
      country: toNullable(country),
      postal_code: toNullable(postalCode),
      website: toNullable(website),
      logo_url: toNullable(logoUrl),
    };
  }, [name, slug, description, address, city, state, country, postalCode, website, logoUrl, toNullable]);

  const getUpdatePayload = useCallback((): CompanyUpdate => {
    return {
      description: toNullable(description),
      address: toNullable(address),
      city: toNullable(city),
      state: toNullable(state),
      country: toNullable(country),
      postal_code: toNullable(postalCode),
      website: toNullable(website),
      logo_url: toNullable(logoUrl),
    };
  }, [description, address, city, state, country, postalCode, website, logoUrl, toNullable]);

  return {
    name,
    slug,
    description,
    address,
    city,
    state,
    country,
    postalCode,
    website,
    logoUrl,
    setName,
    setSlug,
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
    getCreatePayload,
    getUpdatePayload,
    errors,
    isValid,
    isCreateValid,
  };
}

/**
 * Auto-generates slug from company name
 * Helper function for slug generation
 * @param name - Company name
 * @returns Generated slug
 */
export function generateSlugFromName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


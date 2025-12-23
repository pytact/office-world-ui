// Employee Form Hook
// Encapsulates form state and business logic for employee create/edit
// Following R5 rules: Business logic in hooks

import { useState, useCallback, useMemo } from "react";
import {
  EmploymentStatus,
  Department,
  EmploymentType,
  EmploymentLevel,
} from "@/utils/types/requests/employee";

interface UseEmployeeFormParams {
  initialEmploymentStatus?: EmploymentStatus;
}

interface UseEmployeeFormReturn {
  // Form state
  employmentStatus: EmploymentStatus | null;
  setEmploymentStatus: (status: EmploymentStatus | null) => void;

  // Computed values
  showSeparationFields: boolean;
  requiresSeparationFields: boolean;

  // Location dependency state
  selectedCountry: string | null;
  selectedState: string | null;
  selectedCity: string | null;
  setSelectedCountry: (country: string | null) => void;
  setSelectedState: (state: string | null) => void;
  setSelectedCity: (city: string | null) => void;

  // Handlers
  resetLocationFields: () => void;
  handleCountryChange: (country: string | null) => void;
  handleStateChange: (state: string | null) => void;
}

/**
 * Hook for managing employee form state and business logic
 * Handles conditional field visibility and location dependencies
 * @param params - Initial form values
 * @returns Form state, computed values, and handlers
 */
export function useEmployeeForm(
  params?: UseEmployeeFormParams
): UseEmployeeFormReturn {
  const [employmentStatus, setEmploymentStatus] = useState<
    EmploymentStatus | null
  >(params?.initialEmploymentStatus || null);

  // Location dependency state (Country -> State -> City)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // Computed: Show separation fields when status is RESIGNED or TERMINATED
  const showSeparationFields = useMemo(() => {
    return (
      employmentStatus === "RESIGNED" || employmentStatus === "TERMINATED"
    );
  }, [employmentStatus]);

  // Computed: Separation fields are required when status is RESIGNED or TERMINATED
  const requiresSeparationFields = useMemo(() => {
    return showSeparationFields;
  }, [showSeparationFields]);

  // Reset location fields when country changes
  const handleCountryChange = useCallback((country: string | null) => {
    setSelectedCountry(country);
    setSelectedState(null); // Reset state when country changes
    setSelectedCity(null); // Reset city when country changes
  }, []);

  // Reset city when state changes
  const handleStateChange = useCallback((state: string | null) => {
    setSelectedState(state);
    setSelectedCity(null); // Reset city when state changes
  }, []);

  const resetLocationFields = useCallback(() => {
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
  }, []);

  return {
    employmentStatus,
    setEmploymentStatus,
    showSeparationFields,
    requiresSeparationFields,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry: handleCountryChange,
    setSelectedState: handleStateChange,
    setSelectedCity,
    resetLocationFields,
    handleCountryChange,
    handleStateChange,
  };
}


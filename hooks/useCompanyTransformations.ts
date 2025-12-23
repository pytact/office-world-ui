// Company Transformations Hook
// Encapsulates data transformations and derived fields
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import {
  CompanyResponse,
  CompanySummary,
  CompanyProfileResponse,
} from "@/utils/types/responses/company";

export interface TransformedCompany extends CompanySummary {
  statusLabel: string;
  statusBadge: {
    label: string;
    variant: "success" | "error" | "warning" | "default";
  };
  createdAtFormatted: string;
  updatedAtFormatted: string;
  isDeletedIndicator: boolean;
}

export interface TransformedCompanyDetail extends CompanyResponse {
  statusLabel: string;
  statusBadge: {
    label: string;
    variant: "success" | "error" | "warning" | "default";
  };
  createdAtFormatted: string;
  updatedAtFormatted: string;
  createdByLabel: string | null;
  updatedByLabel: string | null;
}

export interface TransformedCompanyProfile extends CompanyProfileResponse {
  statusLabel: string;
  statusBadge: {
    label: string;
    variant: "success" | "error" | "warning" | "default";
  };
  isEditable: boolean;
  isReadOnly: boolean;
}

/**
 * Formats ISO 8601 date string to human-readable format
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string or empty string
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

/**
 * Formats ISO 8601 date string to short format (date only)
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string or empty string
 */
function formatDateShort(dateString: string | null | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

/**
 * Determines status label from is_active boolean
 * @param isActive - Company active status
 * @returns Status label string
 */
function getStatusLabel(isActive: boolean): string {
  return isActive ? "Active" : "Inactive";
}

/**
 * Determines status badge configuration
 * @param isActive - Company active status
 * @param isDeleted - Company deleted status
 * @returns Badge configuration
 */
function getStatusBadge(
  isActive: boolean,
  isDeleted?: boolean
): { label: string; variant: "success" | "error" | "warning" | "default" } {
  if (isDeleted) {
    return { label: "Deleted", variant: "default" };
  }
  if (isActive) {
    return { label: "Active", variant: "success" };
  }
  return { label: "Inactive", variant: "error" };
}

/**
 * Transforms CompanySummary to TransformedCompany
 * Encapsulates all data transformation logic for list items
 * @param companyData - Company summary response data
 * @returns Transformed company data with formatted dates and computed fields
 */
export function transformCompanySummary(
  companyData: CompanySummary
): TransformedCompany {
  return {
    ...companyData,
    statusLabel: getStatusLabel(companyData.is_active),
    statusBadge: getStatusBadge(companyData.is_active, companyData.is_deleted),
    createdAtFormatted: formatDateShort(companyData.created_at),
    updatedAtFormatted: formatDateShort(companyData.updated_at),
    isDeletedIndicator: companyData.is_deleted || false,
  };
}

/**
 * Transforms CompanyResponse to TransformedCompanyDetail
 * Encapsulates all data transformation logic for detail view
 * @param companyData - Company response data
 * @returns Transformed company data with formatted dates and computed fields
 */
export function transformCompanyDetail(
  companyData: CompanyResponse
): TransformedCompanyDetail {
  return {
    ...companyData,
    statusLabel: getStatusLabel(companyData.is_active),
    statusBadge: getStatusBadge(
      companyData.is_active,
      companyData.is_deleted
    ),
    createdAtFormatted: formatDate(companyData.created_at),
    updatedAtFormatted: formatDate(companyData.updated_at),
    createdByLabel: companyData.created_by || null, // TODO: Resolve user name if user lookup available
    updatedByLabel: companyData.updated_by || null, // TODO: Resolve user name if user lookup available
  };
}

/**
 * Transforms CompanyProfileResponse to TransformedCompanyProfile
 * Encapsulates all data transformation logic for profile view
 * @param profileData - Company profile response data
 * @returns Transformed profile data with computed fields
 */
export function transformCompanyProfile(
  profileData: CompanyProfileResponse
): TransformedCompanyProfile {
  return {
    ...profileData,
    statusLabel: getStatusLabel(profileData.is_active),
    statusBadge: getStatusBadge(profileData.is_active, false),
    isEditable: profileData.is_active === true, // Can only edit when active
    isReadOnly: profileData.is_active === false, // Read-only when inactive
  };
}

/**
 * Hook for transforming company list data
 * Encapsulates all data transformations and derived field calculations
 * @param companies - Array of raw company summary responses
 * @returns Array of transformed companies
 */
export function useCompanyTransformations(
  companies: CompanySummary[]
): TransformedCompany[] {
  return useMemo(() => {
    return companies.map(transformCompanySummary);
  }, [companies]);
}

/**
 * Hook for transforming company detail data
 * Encapsulates all data transformations and derived field calculations
 * @param companyData - Raw company response data
 * @returns Transformed company detail data
 */
export function useCompanyDetailTransformation(
  companyData: CompanyResponse | null | undefined
): TransformedCompanyDetail | null {
  return useMemo(() => {
    if (!companyData) return null;
    return transformCompanyDetail(companyData);
  }, [companyData]);
}

/**
 * Hook for transforming company profile data
 * Encapsulates all data transformations and derived field calculations
 * @param profileData - Raw company profile response data
 * @returns Transformed company profile data
 */
export function useCompanyProfileTransformation(
  profileData: CompanyProfileResponse | null | undefined
): TransformedCompanyProfile | null {
  return useMemo(() => {
    if (!profileData) return null;
    return transformCompanyProfile(profileData);
  }, [profileData]);
}


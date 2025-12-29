// Mapped User Hook
// Transforms user data for UI display with formatted dates and computed fields
// Following R5 rules: All transformations in hooks

import { useMemo } from "react";
import { UserResponse, UserListItemResponse } from "@/utils/types/responses/user";
import { useGetUser } from "./useUsers";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";

export interface MappedUser {
  userId: string;
  email: string;
  fullName: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  roleCode: string;
  companyName: string | null;
  companySlug: string | null;
  companyId: string | null;
  status: "active" | "inactive" | "deleted";
  statusBadge: {
    label: string;
    variant: "success" | "error" | "warning" | "default";
  };
  invitationStatus: "pending" | "expired" | "activated" | "unknown";
  invitationStatusBadge: {
    label: string;
    variant: "success" | "warning" | "error" | "default";
  };
  canResendInvite: boolean;
  inviteDate: string | null;
  inviteDateFormatted: string | null;
  activateDate: string | null;
  activateDateFormatted: string | null;
  expiryDate: string | null;
  expiryDateFormatted: string | null;
  reinviteCount: number;
  lastReinviteDate: string | null;
  lastReinviteDateFormatted: string | null;
  isActive: boolean;
  isDeleted: boolean;
}

/**
 * Formats ISO 8601 date string to human-readable format
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string or null
 */
function formatDate(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
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
    return null;
  }
}

/**
 * Formats ISO 8601 date string to short format (date only)
 * @param dateString - ISO 8601 date string
 * @returns Formatted date string or null
 */
function formatDateShort(dateString: string | null | undefined): string | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

/**
 * Determines status badge configuration
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
 * Determines invitation status badge configuration
 */
function getInvitationStatusBadge(
  status: "pending" | "expired" | "activated" | "unknown"
): { label: string; variant: "success" | "warning" | "error" | "default" } {
  switch (status) {
    case "activated":
      return { label: "Activated", variant: "success" };
    case "pending":
      return { label: "Pending", variant: "warning" };
    case "expired":
      return { label: "Expired", variant: "error" };
    default:
      return { label: "Unknown", variant: "default" };
  }
}

/**
 * Transforms UserResponse to MappedUser
 * Encapsulates all data transformation logic
 * @param userData - User response data
 * @returns Transformed user data with formatted dates and computed fields
 */
export function mapUserData(userData: UserResponse | UserListItemResponse): MappedUser {
  const roleCode = userData.role?.code || "";
  const roleName = userData.role?.name || "";
  const companyName = userData.company?.name || null;
  const companySlug = userData.company?.slug || null;
  const companyId = userData.company?.company_id || null;

    // Determine invitation status
  let invitationStatus: "pending" | "expired" | "activated" | "unknown" = "unknown";
    if (userData.invitation_status) {
      invitationStatus = userData.invitation_status;
    } else if (userData.activate_at) {
      invitationStatus = "activated";
    } else if (userData.invite_at) {
    // Check if expired
    if (userData.expiry) {
      const expiryDate = new Date(userData.expiry);
      const now = new Date();
      invitationStatus = now > expiryDate ? "expired" : "pending";
    } else {
      invitationStatus = "pending";
    }
    }

    // Determine status
  const status: "active" | "inactive" | "deleted" = userData.is_deleted
    ? "deleted"
    : userData.is_active
    ? "active"
    : "inactive";

  // Build full name
  const fullName = [userData.first_name, userData.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || userData.email;

    return {
    userId: userData.user_id,
      email: userData.email,
    fullName,
      firstName: userData.first_name,
      lastName: userData.last_name,
      role: roleName,
      roleCode: roleCode,
    companyName,
    companySlug,
    companyId,
      status,
    statusBadge: getStatusBadge(userData.is_active, userData.is_deleted),
      invitationStatus,
    invitationStatusBadge: getInvitationStatusBadge(invitationStatus),
    canResendInvite: "can_resend_invite" in userData ? (userData.can_resend_invite ?? false) : false,
    inviteDate: userData.invite_at || null,
    inviteDateFormatted: formatDateShort(userData.invite_at),
    activateDate: userData.activate_at || null,
    activateDateFormatted: formatDateShort(userData.activate_at),
    expiryDate: userData.expiry || null,
    expiryDateFormatted: formatDateShort(userData.expiry),
    reinviteCount: "reinvite_count" in userData ? (userData.reinvite_count || 0) : 0,
    lastReinviteDate: "last_reinvite_at" in userData ? (userData.last_reinvite_at || null) : null,
    lastReinviteDateFormatted: "last_reinvite_at" in userData ? formatDateShort(userData.last_reinvite_at) : null,
      isActive: userData.is_active,
    isDeleted: userData.is_deleted || false,
    };
}

/**
 * Hook that transforms user list item data for UI display
 * Encapsulates all data transformation logic
 * @param userData - User list item response data
 * @returns Transformed user data with formatted dates
 */
export function useMappedUserListItem(
  userData: UserListItemResponse | null | undefined
): MappedUser | null {
  return useMemo(() => {
    if (!userData) return null;
    return mapUserData(userData);
  }, [userData]);
}

/**
 * Hook that transforms user detail data for UI display
 * Encapsulates all data transformation logic
 * @param userData - User response data
 * @returns Transformed user data with formatted dates
 */
export function useMappedUserDetail(
  userData: UserResponse | null | undefined
): MappedUser | null {
  return useMemo(() => {
    if (!userData) return null;
    return mapUserData(userData);
  }, [userData]);
}

/**
 * Hook that fetches and transforms user data by ID
 * Combines useGetUser with useMappedUserDetail
 * Extracts ETag from GET response for use in PATCH operations
 * @param userId - User ID to fetch
 * @returns User data, loading state, error, and ETag
 */
export function useMappedUser(userId: string | null) {
  const query = useGetUser(userId);
  
  const mappedUser = useMappedUserDetail(query.data?.data || null);

  // Extract ETag from updated_at field in response data
  // ETag format is based on updated_at timestamp (e.g., "20240120T103000Z")
  const etag = useMemo(() => {
    if (!query.data?.data) return null;
    // Extract ETag from updated_at field (converts ISO 8601 to ETag format)
    return extractETagFromUpdatedAt(query.data.data);
  }, [query.data?.data]);

  return {
    user: mappedUser,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
    etag, // ETag from GET response for use in PATCH operations
  };
}

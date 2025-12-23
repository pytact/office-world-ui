// UserDetail UI Component
// SCR_USER_DETAIL - Pure UI component following R7 and R10

"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card, Button, Badge } from "@/components/ui";
import { useUserMutations } from "@/hooks/useUserMutations";
import { useUserRoleForm } from "@/modules/users/forms/useUserRoleForm";
import { useUserRoleFormSubmit } from "@/modules/users/forms/useUserRoleFormSubmit";
import { UserRoleChangeModal } from "./UserRoleChangeModal";
import { UserCompanyReassignModal } from "./UserCompanyReassignModal";
import { useAuthContext } from "@/context";
import { useToast } from "@/context/ToastContext";
import { useReassignCompany, useCompanies, useRoles } from "@/hooks/useUsers";
import { userRoutes } from "@/utils/routes";
import { spacing, typography, colors } from "@/theme/tokens";

import type { MappedUser } from "@/hooks/useMappedUser";

interface UserDetailProps {
  user: MappedUser;
  etag?: string | null; // ETag from GET response for PATCH operations
}

export const UserDetail = React.memo(function UserDetail({ user, etag }: UserDetailProps) {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isCompanyReassignModalOpen, setIsCompanyReassignModalOpen] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedRoleCodeForReassign, setSelectedRoleCodeForReassign] = useState("");
  
  const { user: currentUser } = useAuthContext();
  const { showSuccess, showError } = useToast();
  const pathname = usePathname();

  // Determine back link based on current route context
  const backLink = useMemo(() => {
    if (pathname?.startsWith("/platform")) {
      return userRoutes.platform.list;
    } else if (pathname?.startsWith("/company")) {
      return userRoutes.company.list;
    }
    return userRoutes.shared.detail(user.userId); // Fallback
  }, [pathname, user.userId]);
  const mutations = useUserMutations();
  const reassignCompanyMutation = useReassignCompany();
  // Only fetch companies for SuperAdmin (for company reassignment)
  const { isSuperAdmin: currentUserIsSuperAdmin } = useAuthContext();
  const { data: companiesData } = useCompanies(); // Hook already has enabled check for SuperAdmin
  const { data: rolesData } = useRoles();
  
  const roleForm = useUserRoleForm({ defaultValues: { role_code: user.roleCode } });
  const { submit: submitRoleChange, isLoading: isRoleChanging } = useUserRoleFormSubmit(
    roleForm,
    user.userId,
    etag || undefined
  );

  // Calculate permissions based on current user role
  const currentUserRole = currentUser?.role?.toLowerCase() || "";
  const isSuperAdmin = currentUser?.is_super_admin || currentUserRole === "superadmin";
  const isCEO = currentUserRole === "ceo";
  const isHR = currentUserRole === "hr";
  const isCurrentUser = currentUser?.user_id === user.userId;

  // Permission checks
  const canChangeRole = useMemo(() => {
    if (isCurrentUser) return false; // Cannot change own role
    return isSuperAdmin || isCEO || isHR;
  }, [isSuperAdmin, isCEO, isHR, isCurrentUser]);

  const canDeactivate = useMemo(() => {
    if (isCurrentUser) return false; // Cannot deactivate own account
    return isSuperAdmin || isCEO || isHR;
  }, [isSuperAdmin, isCEO, isHR, isCurrentUser]);

  const canReactivate = useMemo(() => {
    return isSuperAdmin || isCEO || isHR;
  }, [isSuperAdmin, isCEO, isHR]);

  const canReassignCompany = useMemo(() => {
    // Only SuperAdmin can reassign companies, and cannot reassign SuperAdmin users
    return isSuperAdmin && user.roleCode !== "superadmin";
  }, [isSuperAdmin, user.roleCode]);

  const {
    formState: { errors },
    watch,
    setValue,
    handleSubmit,
  } = roleForm;

  const selectedRoleCode = watch("role_code");

  const handleRoleChangeOpen = useCallback(() => {
    setIsRoleModalOpen(true);
  }, []);

  const handleRoleChangeClose = useCallback(() => {
    setIsRoleModalOpen(false);
    roleForm.reset();
  }, [roleForm]);

  const handleRoleChangeSubmit = useCallback(async () => {
    await handleSubmit(async (values) => {
      try {
        await submitRoleChange(values);
        showSuccess("User role changed successfully");
        setIsRoleModalOpen(false);
      } catch (error) {
        showError("Failed to change user role");
        // Error handled by form
      }
    })();
  }, [handleSubmit, submitRoleChange, showSuccess, showError]);

  const handleDeactivate = useCallback(async () => {
    if (confirm("Are you sure you want to deactivate this user?")) {
      try {
        // Use new unified status update API: PATCH /v1/users/{user_id}/status
        // ETag is required in header for concurrency control
        await mutations.updateUserStatus(user.userId, "inactive", etag || undefined);
        showSuccess("User deactivated successfully");
      } catch (error) {
        showError("Failed to deactivate user");
      }
    }
  }, [mutations, user.userId, etag, showSuccess, showError]);

  const handleReactivate = useCallback(async () => {
    try {
      // Use new unified status update API: PATCH /v1/users/{user_id}/status
      // ETag is required in header for concurrency control
      await mutations.updateUserStatus(user.userId, "active", etag || undefined);
      showSuccess("User reactivated successfully");
    } catch (error) {
      showError("Failed to reactivate user");
    }
  }, [mutations, user.userId, etag, showSuccess, showError]);

  const handleResendInvite = React.useCallback(async () => {
    try {
      await mutations.resendInvitation(user.userId);
      showSuccess("Invitation resent successfully");
    } catch (error) {
      showError("Failed to resend invitation");
    }
  }, [mutations, user.userId, showSuccess, showError]);

  const handleCompanyReassignOpen = useCallback(() => {
    setIsCompanyReassignModalOpen(true);
    setSelectedCompanyId("");
    setSelectedRoleCodeForReassign("");
  }, []);

  const handleCompanyReassignClose = useCallback(() => {
    setIsCompanyReassignModalOpen(false);
    setSelectedCompanyId("");
    setSelectedRoleCodeForReassign("");
  }, []);

  const handleCompanyReassignSubmit = useCallback(async () => {
    if (!selectedCompanyId) return;
    
    try {
      const payload = selectedRoleCodeForReassign 
        ? { role_code: selectedRoleCodeForReassign }
        : {};
      
      await reassignCompanyMutation.mutateAsync({
        user_id: user.userId,
        company_id: selectedCompanyId,
        payload,
        etag: etag || undefined, // ETag is required for PATCH operations
      });
      
      showSuccess("User company reassigned successfully");
      setIsCompanyReassignModalOpen(false);
      setSelectedCompanyId("");
      setSelectedRoleCodeForReassign("");
    } catch (error) {
      showError("Failed to reassign user company");
    }
  }, [selectedCompanyId, selectedRoleCodeForReassign, reassignCompanyMutation, user.userId, etag, showSuccess, showError]);

  // Transform companies data for Select component
  const companyOptions = useMemo(() => {
    if (!companiesData?.data?.items) {
      return [];
    }
    return companiesData.data.items
      .filter((company) => company.is_active)
      .map((company) => ({
        value: company.company_id,
        label: company.name,
      }));
  }, [companiesData]);

  // Transform roles data for Select component
  // HR can only assign Manager and Employee roles
  // CEO cannot assign CEO role to others
  const roleOptions = useMemo(() => {
    if (!rolesData?.data?.items) {
      return [];
    }
    return rolesData.data.items
      .filter((role) => {
        // Cannot reassign to SuperAdmin role
        if (role.code === "superadmin") return false;
        // HR can only assign Manager and Employee (not CEO, not HR)
        if (isHR) {
          return role.code === "manager" || role.code === "employee";
        }
        // CEO cannot assign CEO role to others
        if (role.code === "ceo" && isCEO) return false;
        return true;
      })
      .map((role) => ({
        value: role.code,
        label: role.name,
      }));
  }, [rolesData, isHR]);

  // Memoized style objects - Enhanced for modern UX
  const containerStyle = useMemo(
    () => ({
      padding: `${spacing[8]} ${spacing[6]}`,
      maxWidth: "1200px",
      margin: "0 auto",
    } as const),
    []
  );

  const backLinkStyle = useMemo(
    () => ({
      color: colors.primary,
      textDecoration: "none",
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize.body,
    } as const),
    []
  );

  const backLinkContainerStyle = useMemo(
    () => ({
      marginBottom: spacing[6],
    } as const),
    []
  );

  const headingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.h1,
      marginBottom: spacing[8],
    } as const),
    []
  );

  const cardsContainerStyle = useMemo(
    () => ({
      display: "grid",
      gap: spacing[8],
    } as const),
    []
  );

  const cardHeadingStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.semibold,
      marginBottom: spacing[6],
      paddingBottom: spacing[3],
      borderBottom: `2px solid ${colors.borderLight}`,
    } as const),
    []
  );

  const gridStyle = useMemo(
    () => ({
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: spacing[5],
      rowGap: spacing[6],
    } as const),
    []
  );

  const fieldItemStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      padding: spacing[4],
      backgroundColor: colors.backgroundSecondary,
      borderRadius: "4px",
    } as const),
    []
  );

  const labelStyle = useMemo(
    () => ({
      display: "block",
      fontSize: typography.fontSize.small,
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      fontWeight: typography.fontWeight.medium,
      marginBottom: spacing[2],
    } as const),
    []
  );

  const textStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: colors.textPrimary,
      lineHeight: typography.lineHeight.body,
    } as const),
    []
  );

  const roleSectionStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[4],
    } as const),
    []
  );

  const roleLabelStyle = useMemo(
    () => ({
      display: "block",
      marginBottom: spacing[2],
      fontSize: typography.fontSize.small,
      fontFamily: typography.fontFamily,
      color: colors.textMuted,
    } as const),
    []
  );

  const roleTextStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      marginBottom: spacing[4],
    } as const),
    []
  );

  const actionsContainerStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[4],
      flexWrap: "wrap",
    } as const),
    []
  );

  const handleRoleCodeChange = useCallback(
    (roleCode: string) => {
      setValue("role_code", roleCode, { shouldValidate: true });
    },
    [setValue]
  );

  return (
    <div style={containerStyle}>
      <div style={backLinkContainerStyle}>
        <Link href={backLink} style={backLinkStyle}>
          ← Back to Users
        </Link>
      </div>

      <h1 style={headingStyle}>User Details</h1>

      <div style={cardsContainerStyle}>
        {/* User Information Card */}
        <Card padding="lg" variant="default">
          <h2 style={cardHeadingStyle}>User Information</h2>
          <div style={gridStyle}>
            <div style={fieldItemStyle}>
              <label style={labelStyle}>Email</label>
              <p style={textStyle}>{user.email}</p>
            </div>
            <div style={fieldItemStyle}>
              <label style={labelStyle}>Full Name</label>
              <p style={textStyle}>{user.fullName}</p>
            </div>
            <div style={fieldItemStyle}>
              <label style={labelStyle}>Status</label>
              <Badge variant={user.statusBadge.variant}>
                {user.statusBadge.label}
              </Badge>
            </div>
            <div style={fieldItemStyle}>
              <label style={labelStyle}>Invitation Status</label>
              <Badge variant={user.invitationStatusBadge.variant}>
                {user.invitationStatusBadge.label}
              </Badge>
            </div>
            {user.companyName && (
              <div style={fieldItemStyle}>
                <label style={labelStyle}>Company</label>
                <p style={textStyle}>{user.companyName}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Role Management Card */}
        <Card padding="lg" variant="default">
          <h2 style={cardHeadingStyle}>Role Management</h2>
          <div style={roleSectionStyle}>
            <div style={fieldItemStyle}>
              <label style={roleLabelStyle}>Current Role</label>
              <p style={roleTextStyle}>{user.role}</p>
            </div>
            <div style={{ display: "flex", gap: spacing[4], flexWrap: "wrap" }}>
              {canChangeRole && (
                <Button type="button" onClick={handleRoleChangeOpen}>
                  Change Role
                </Button>
              )}
              {canReassignCompany && (
                <Button type="button" onClick={handleCompanyReassignOpen} variant="secondary">
                  Reassign Company
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Role Change Modal */}
        <UserRoleChangeModal
          isOpen={isRoleModalOpen}
          onClose={handleRoleChangeClose}
          currentRoleCode={user.roleCode}
          currentRoleName={user.role}
          selectedRoleCode={selectedRoleCode}
          onRoleChange={handleRoleCodeChange}
          onSubmit={handleRoleChangeSubmit}
          isLoading={isRoleChanging}
          error={errors.root?.message || errors.role_code?.message || undefined}
          warningMessage={
            selectedRoleCode === "ceo" && selectedRoleCode !== user.roleCode
              ? "Warning: Only one CEO is allowed per company. If the company already has a CEO, this change will fail."
              : undefined
          }
        />

        {/* Company Reassignment Modal */}
        {canReassignCompany && (
          <UserCompanyReassignModal
            isOpen={isCompanyReassignModalOpen}
            onClose={handleCompanyReassignClose}
            currentCompanyName={user.companyName}
            selectedCompanyId={selectedCompanyId}
            onCompanyChange={setSelectedCompanyId}
            selectedRoleCode={selectedRoleCodeForReassign}
            onRoleChange={setSelectedRoleCodeForReassign}
            companyOptions={companyOptions}
            roleOptions={roleOptions}
            onSubmit={handleCompanyReassignSubmit}
            isLoading={reassignCompanyMutation.isPending}
            error={reassignCompanyMutation.error?.message || undefined}
          />
        )}

        {/* Actions Card */}
        <Card padding="lg" variant="default">
          <h2 style={cardHeadingStyle}>Actions</h2>
          <div style={actionsContainerStyle}>
            {user.isActive ? (
              canDeactivate && (
              <Button
                onClick={handleDeactivate}
                isLoading={mutations.isDeleting}
                type="button"
              >
                Deactivate User
              </Button>
              )
            ) : (
              canReactivate && (
              <Button
                onClick={handleReactivate}
                isLoading={mutations.isReactivating}
                type="button"
              >
                Reactivate User
              </Button>
              )
            )}
            {user.canResendInvite && (isSuperAdmin || isCEO || isHR) && (
              <Button
                onClick={handleResendInvite}
                isLoading={mutations.isResending}
                type="button"
              >
                Resend Invitation
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
});

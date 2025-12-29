// Company Detail Platform Container
// SCR_COMPANY_DETAIL_PLATFORM - Container component following R7
// Uses hooks for all logic, no API calls

"use client";

import React, { useCallback, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCompanyDetail } from "@/hooks/useCompanyDetail";
import { useUpdateCompany, useDeleteCompany } from "@/hooks/useCompanies";
import { useAuthContext } from "@/context";
import { companyRoutes } from "@/utils/routes";
import { Loader, ErrorState, AccessDenied } from "@/components/ui";
import { CompanyDetailPlatform } from "./CompanyDetailPlatform";
import { CompanyStatusConfirmationModal } from "./CompanyStatusConfirmationModal";
import { CompanyDeleteConfirmationModal } from "./CompanyDeleteConfirmationModal";
import { CompanySoftDeleteConfirmationModal } from "./CompanySoftDeleteConfirmationModal";

export function CompanyDetailPlatformContainer() {
  const params = useParams();
  const router = useRouter();
  const { isSuperAdmin } = useAuthContext();
  const companyId = params?.companyId as string | null;

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSoftDeleteModal, setShowSoftDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<"activate" | "deactivate" | null>(null);

  const {
    company,
    isLoading,
    isError,
    error,
    status,
    etag,
    refetch,
  } = useCompanyDetail({ company_id: companyId });

  const updateMutation = useUpdateCompany();
  const deleteMutation = useDeleteCompany();

  const handleActivate = useCallback(() => {
    setPendingAction("activate");
    setShowStatusModal(true);
  }, []);

  const handleDeactivate = useCallback(() => {
    setPendingAction("deactivate");
    setShowStatusModal(true);
  }, []);

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
  }, []);

  const handleSoftDelete = useCallback(() => {
    setShowSoftDeleteModal(true);
  }, []);

  const handleRestore = useCallback(() => {
    setShowRestoreModal(true);
  }, []);

  const handleStatusConfirm = useCallback(async () => {
    if (!company || !pendingAction) return;

    try {
      const isActive = pendingAction === "activate";
      await updateMutation.mutateAsync({
        company_id: company.company_id,
        payload: { is_active: isActive },
        etag: etag || undefined,
      });
      setShowStatusModal(false);
      setPendingAction(null);
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  }, [company, pendingAction, updateMutation, refetch, etag]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!company) return;

    try {
      await deleteMutation.mutateAsync({
        company_id: company.company_id,
        etag: etag || undefined,
      });
      setShowDeleteModal(false);
      router.push(companyRoutes.platform.list);
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  }, [company, deleteMutation, router, etag]);

  const handleSoftDeleteConfirm = useCallback(async () => {
    if (!company) return;

    try {
      await updateMutation.mutateAsync({
        company_id: company.company_id,
        payload: { is_deleted: true },
        etag: etag || undefined,
      });
      setShowSoftDeleteModal(false);
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  }, [company, updateMutation, refetch, etag]);

  const handleRestoreConfirm = useCallback(async () => {
    if (!company) return;

    try {
      await updateMutation.mutateAsync({
        company_id: company.company_id,
        payload: { is_deleted: false },
        etag: etag || undefined,
      });
      setShowRestoreModal(false);
      refetch();
    } catch (error) {
      // Error handling is done by the mutation hook
    }
  }, [company, updateMutation, refetch, etag]);

  const handleCancel = useCallback(() => {
    router.push(companyRoutes.platform.list);
  }, [router]);

  // SuperAdmin-only access
  if (!isSuperAdmin) {
    return <AccessDenied message="Only SuperAdmin can view company details" />;
  }

  if (isLoading) return <Loader message="Loading company details..." />;
  if (isError)
    return (
      <ErrorState
        message={error?.message || "Failed to load company details"}
        onRetry={refetch}
      />
    );
  if (!company) {
    return <ErrorState message="Company not found" onRetry={refetch} />;
  }

  return (
    <>
      <CompanyDetailPlatform
        company={company}
        status={status}
        onActivate={handleActivate}
        onDeactivate={handleDeactivate}
        onDelete={handleDelete}
        onSoftDelete={handleSoftDelete}
        onRestore={handleRestore}
        onCancel={handleCancel}
        isUpdating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
        isSoftDeleting={updateMutation.isPending}
        isRestoring={updateMutation.isPending}
      />

      <CompanyStatusConfirmationModal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setPendingAction(null);
        }}
        onConfirm={handleStatusConfirm}
        action={pendingAction || "activate"}
        companyName={company.name}
        isLoading={updateMutation.isPending}
      />

      <CompanyDeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        companyName={company.name}
        isLoading={deleteMutation.isPending}
      />

      <CompanySoftDeleteConfirmationModal
        isOpen={showSoftDeleteModal}
        onClose={() => setShowSoftDeleteModal(false)}
        onConfirm={handleSoftDeleteConfirm}
        companyName={company.name}
        isLoading={updateMutation.isPending}
        action="soft-delete"
      />

      <CompanySoftDeleteConfirmationModal
        isOpen={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        onConfirm={handleRestoreConfirm}
        companyName={company.name}
        isLoading={updateMutation.isPending}
        action="restore"
      />
    </>
  );
}


// Employee Detail Container
// SCR_EMPLOYEE_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useEmployeeDetail } from "@/hooks/useEmployeeDetail";
import { useUpdateEmployee, useDeleteEmployee } from "@/hooks/useEmployees";
import { useEmployeePermissions } from "@/hooks/useEmployeePermissions";
import { EmployeeDetail } from "./EmployeeDetail";
import { EmployeeDeactivateConfirmationModal } from "./EmployeeDeactivateConfirmationModal";
import { EmployeeDeleteConfirmationModal } from "./EmployeeDeleteConfirmationModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useToast } from "@/context/ToastContext";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

export function EmployeeDetailContainer() {
  const params = useParams();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const employeeId = params?.id as string;

  const { canViewEmployeeDetail, canUpdateEmployee } = useEmployeePermissions();
  const {
    isLoading,
    isError,
    error,
    refetch,
    employee,
    canEdit: canEditFromAPI,
    canDeactivate,
    canSoftDelete,
    isActive,
  } = useEmployeeDetail(employeeId);

  // Combine API permissions with client-side permissions
  // CEO and HR should always be able to edit based on client-side permissions
  const canEdit = canUpdateEmployee || canEditFromAPI;

  const updateMutation = useUpdateEmployee();
  const deleteMutation = useDeleteEmployee();

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Memoized handlers for modal actions
  const handleOpenDeactivateModal = useCallback(() => {
    setIsDeactivateModalOpen(true);
  }, []);

  const handleCloseDeactivateModal = useCallback(() => {
    setIsDeactivateModalOpen(false);
  }, []);

  const handleOpenDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setIsDeleteModalOpen(false);
  }, []);

  // Permission check
  if (!canViewEmployeeDetail) {
    return <AccessDenied message="You do not have permission to view employee details." />;
  }

  // Loading state
  if (isLoading) {
    return <Loader />;
  }

  // Error state
  if (isError || !employee) {
    return (
      <ErrorState
        message={error?.message || "Failed to load employee details"}
        onRetry={refetch}
      />
    );
  }

  // Handle deactivate
  const handleDeactivate = useCallback(async () => {
    try {
      if (!employee) return;

      const etag = employee.updated_at; // Use updated_at as ETag
      await updateMutation.mutateAsync({
        employee_id: employee.employee_id,
        payload: { is_active: false },
        etag,
      });

      showSuccess("Employee deactivated successfully");
      setIsDeactivateModalOpen(false);
      refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError?.message || "Failed to deactivate employee");
    }
  }, [employee, updateMutation, showSuccess, showError, refetch]);

  // Handle reactivate
  const handleReactivate = useCallback(async () => {
    try {
      if (!employee) return;

      const etag = employee.updated_at;
      await updateMutation.mutateAsync({
        employee_id: employee.employee_id,
        payload: { is_active: true },
        etag,
      });

      showSuccess("Employee reactivated successfully");
      refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError?.message || "Failed to reactivate employee");
    }
  }, [employee, updateMutation, showSuccess, showError, refetch]);

  // Handle delete
  const handleDelete = useCallback(async () => {
    try {
      if (!employee) return;

      const etag = employee.updated_at;
      await deleteMutation.mutateAsync({
        employee_id: employee.employee_id,
        etag,
      });

      showSuccess("Employee deleted successfully");
      setIsDeleteModalOpen(false);
      router.push(employeeRoutes.company.list);
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError?.message || "Failed to delete employee");
    }
  }, [employee, deleteMutation, showSuccess, showError, router]);

  // Handle edit (navigate to edit page)
  const handleEdit = useCallback(() => {
    if (employee) {
      router.push(employeeRoutes.company.edit(employee.employee_id));
    }
  }, [employee, router]);

  return (
    <>
      <EmployeeDetail
        employee={employee}
        canEdit={canEdit}
        canDeactivate={canDeactivate}
        canSoftDelete={canSoftDelete}
        isActive={isActive}
        onEdit={canEdit ? handleEdit : undefined}
        onDeactivate={
          canDeactivate && isActive ? handleOpenDeactivateModal : undefined
        }
        onReactivate={
          canDeactivate && !isActive ? handleReactivate : undefined
        }
        onDelete={canSoftDelete ? handleOpenDeleteModal : undefined}
        isDeactivating={updateMutation.isPending}
        isDeleting={deleteMutation.isPending}
      />

      <EmployeeDeactivateConfirmationModal
        isOpen={isDeactivateModalOpen}
        onClose={handleCloseDeactivateModal}
        onConfirm={handleDeactivate}
        employeeName={employee.user.full_name}
        isLoading={updateMutation.isPending}
      />

      <EmployeeDeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDelete}
        employeeName={employee.user.full_name}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}


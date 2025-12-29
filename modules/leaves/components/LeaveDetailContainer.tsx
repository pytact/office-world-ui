// Leave Detail Container
// SCR_LEAVE_DETAIL - Container component following R7
// Handles business logic, hooks, and state management

"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { LeaveDetail } from "./LeaveDetail";
import { LeaveRejectionModal } from "./LeaveRejectionModal";
import { LeaveCancellationModal } from "./LeaveCancellationModal";
import { LeaveApprovalModal } from "./LeaveApprovalModal";
import { Loader } from "@/components/ui/Loader";
import { ErrorState } from "@/components/ui/ErrorState";
import { AccessDenied } from "@/components/ui/AccessDenied";
import { useGetLeave, useLeaveAction } from "@/hooks/useLeaves";
import { useLeavePermissions } from "@/hooks/useLeavePermissions";
import { useLeaveContext } from "@/context/LeaveContext";
import { transformLeaveDetail } from "@/hooks/useLeaveTransformations";
import { extractETagFromUpdatedAt } from "@/utils/helpers/etag";
import { useLeaveRejectionForm, useLeaveRejectionFormSubmit } from "@/modules/leaves/forms";
import { useToast } from "@/context/ToastContext";
import { leaveRoutes } from "@/utils/routes";
import { NormalizedError } from "@/core/http/normalizers/error-normalizer";

export function LeaveDetailContainer() {
  // ALL hooks must be called BEFORE any early returns (R15 Issue 12)
  const router = useRouter();
  const params = useParams();
  const leaveId = params?.leaveId as string;
  const { userRole, employeeId } = useLeaveContext();
  const { showSuccess, showError } = useToast();

  const leaveQuery = useGetLeave(leaveId);
  const actionMutation = useLeaveAction();

  // Local state for modals
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  // Rejection form
  const rejectionForm = useLeaveRejectionForm();

  // Get leave-specific permissions
  // Use employeeId instead of userId for proper comparisons
  const leavePermissions = useLeavePermissions({
    userRole,
    employeeId, // Use employeeId for leave comparisons
    leave: leaveQuery.data?.data || null,
  });

  // Transform leave data
  const transformedLeave = useMemo(() => {
    if (!leaveQuery.data?.data) return null;
    return transformLeaveDetail(leaveQuery.data.data);
  }, [leaveQuery.data?.data]);

  // Extract ETag for mutations
  const etag = useMemo(() => {
    return extractETagFromUpdatedAt(leaveQuery.data?.data) || undefined;
  }, [leaveQuery.data?.data]);

  // Rejection form submit hook (following R10)
  const { submit: submitRejection, isLoading: isRejecting } = useLeaveRejectionFormSubmit(
    rejectionForm,
    {
      leaveId,
      etag,
      onSuccess: () => {
        setShowRejectionModal(false);
        rejectionForm.reset();
        leaveQuery.refetch();
      },
    }
  );

  // Handle approval
  const handleApprove = useCallback(async () => {
    if (!leaveId || !etag) return;
    try {
      await actionMutation.mutateAsync({
        leave_id: leaveId,
        payload: { action: "approve" },
        etag,
      });
      showSuccess("Leave request approved successfully");
      setShowApprovalModal(false);
      leaveQuery.refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError?.message || "Failed to approve leave request");
    }
  }, [leaveId, etag, actionMutation, showSuccess, showError, leaveQuery]);

  // Handle rejection (opens modal, form submission is handled by modal)
  const handleReject = useCallback(() => {
    setShowRejectionModal(true);
  }, []);

  // Handle cancellation
  const handleCancel = useCallback(async () => {
    if (!leaveId || !etag) return;
    try {
      await actionMutation.mutateAsync({
        leave_id: leaveId,
        payload: { action: "cancel" },
        etag,
      });
      showSuccess("Leave request cancelled successfully");
      setShowCancellationModal(false);
      leaveQuery.refetch();
    } catch (error) {
      const normalizedError = error as NormalizedError;
      showError(normalizedError?.message || "Failed to cancel leave request");
    }
  }, [leaveId, etag, actionMutation, showSuccess, showError, leaveQuery]);

  // Loading state (AFTER all hooks)
  if (leaveQuery.isLoading) {
    return <Loader />;
  }

  // Error state (AFTER all hooks)
  if (leaveQuery.isError) {
    return (
      <ErrorState
        message={leaveQuery.error?.message || "Failed to load leave request"}
        onRetry={() => leaveQuery.refetch()}
      />
    );
  }

  // 404 or no data
  if (!leaveQuery.data?.data || !transformedLeave) {
    return (
      <ErrorState
        message="Leave request not found"
        onRetry={() => router.push(leaveRoutes.company.list)}
      />
    );
  }

  // Permission check
  if (leavePermissions.isReadOnly && !leavePermissions.canCancel) {
    return (
      <AccessDenied
        message="You don't have access to this leave request"
        redirectTo={leaveRoutes.company.list}
      />
    );
  }

  return (
    <>
      <LeaveDetail
        leave={transformedLeave}
        canApprove={leavePermissions.canApprove}
        canReject={leavePermissions.canReject}
        canCancel={leavePermissions.canCancel}
        onApprove={() => setShowApprovalModal(true)}
        onReject={() => setShowRejectionModal(true)}
        onCancel={() => setShowCancellationModal(true)}
        isApproving={actionMutation.isPending}
        isRejecting={isRejecting}
        isCancelling={actionMutation.isPending}
        userRole={userRole}
      />

      {/* Rejection Modal */}
      <LeaveRejectionModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          rejectionForm.reset();
        }}
        form={rejectionForm}
        onSubmit={submitRejection}
        isLoading={isRejecting}
      />

      {/* Cancellation Modal */}
      <LeaveCancellationModal
        isOpen={showCancellationModal}
        onClose={() => setShowCancellationModal(false)}
        onConfirm={handleCancel}
        isLoading={actionMutation.isPending}
      />

      {/* Approval Modal */}
      <LeaveApprovalModal
        isOpen={showApprovalModal}
        onClose={() => setShowApprovalModal(false)}
        onConfirm={handleApprove}
        isLoading={actionMutation.isPending}
      />
    </>
  );
}


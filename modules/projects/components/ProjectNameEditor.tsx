// Project Name Editor Component
// Feature-specific component - R16 Layer 2
// Inline editor for project name following R17 principles

"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Input, Button } from "@/components/ui";
import { spacing, typography, colors, borderRadius } from "@/theme/tokens";
import { useUpdateProject } from "@/hooks/useProjects";
import { useToast } from "@/context/ToastContext";
import { extractETag } from "@/utils/helpers/etag";
import type { ProjectUpdate } from "@/utils/types/requests/project";

interface ProjectNameEditorProps {
  projectId: string;
  currentName: string;
  canEdit: boolean;
  onUpdate?: () => void;
  etag?: string;
}

/**
 * Project Name Editor Component
 * Inline editor for project name
 * Following R17: Secondary action, inline editing pattern
 * Following R14: Memoized for performance
 */
export const ProjectNameEditor = React.memo(function ProjectNameEditor({
  projectId,
  currentName,
  canEdit,
  onUpdate,
  etag,
}: ProjectNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(currentName);
  const updateMutation = useUpdateProject();
  const { showSuccess, showError } = useToast();

  // Sync editedName when currentName changes externally
  useEffect(() => {
    setEditedName(currentName);
  }, [currentName]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditedName(currentName);
  }, [currentName]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditedName(currentName);
  }, [currentName]);

  const handleSave = useCallback(async () => {
    if (!editedName.trim()) {
      showError("Project name cannot be empty");
      return;
    }

    if (editedName.trim() === currentName) {
      setIsEditing(false);
      return;
    }

    try {
      const payload: ProjectUpdate = {
        name: editedName.trim(),
      };

      await updateMutation.mutateAsync({
        project_id: projectId,
        payload,
        etag,
      });

      setIsEditing(false);
      showSuccess("Project name updated successfully");
      onUpdate?.();
    } catch (error) {
      // Error handling is done by mutation and toast
    }
  }, [editedName, currentName, projectId, etag, updateMutation, showSuccess, showError, onUpdate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSave();
      } else if (e.key === "Escape") {
        handleCancel();
      }
    },
    [handleSave, handleCancel]
  );

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      alignItems: "center" as const,
      gap: spacing[3],
      flexWrap: "wrap" as const,
    } as const),
    []
  );

  const nameStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.textPrimary,
      margin: 0,
      flex: "1 1 auto" as const,
      minWidth: "200px",
    } as const),
    []
  );

  const inputStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h1,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      flex: "1 1 auto" as const,
      minWidth: "200px",
    } as const),
    []
  );

  const buttonGroupStyle = useMemo(
    () => ({
      display: "flex",
      gap: spacing[2],
      alignItems: "center" as const,
    } as const),
    []
  );

  const editButtonStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.small,
      fontWeight: typography.fontWeight.medium,
      fontFamily: typography.fontFamily,
      color: colors.primary,
      cursor: "pointer",
      textDecoration: "none",
      border: `1px solid ${colors.primary}`,
      background: "transparent",
      padding: `${spacing[2]} ${spacing[4]}`,
      borderRadius: borderRadius.sm,
      transition: "background-color 0.2s, color 0.2s",
    } as const),
    []
  );

  if (!canEdit) {
    return <h1 style={nameStyle}>{currentName}</h1>;
  }

  if (isEditing) {
    return (
      <div style={containerStyle}>
        <div style={inputStyle}>
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            disabled={updateMutation.isPending}
          />
        </div>
        <div style={buttonGroupStyle}>
          <Button
            type="button"
            variant="primary"
            onClick={handleSave}
            isLoading={updateMutation.isPending}
            disabled={updateMutation.isPending || !editedName.trim()}
          >
            Save
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={nameStyle}>{currentName}</h1>
      <button
        type="button"
        onClick={handleEdit}
        style={editButtonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = colors.backgroundSecondary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        Edit
      </button>
    </div>
  );
});


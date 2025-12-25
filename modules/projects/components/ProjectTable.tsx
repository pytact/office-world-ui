// Project Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for project list

"use client";

import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { ProjectRow } from "./ProjectRow";
import type { TransformedProjectSummary } from "@/hooks/useProjectTransformations";

interface ProjectTableProps {
  projects: TransformedProjectSummary[];
  onProjectClick: (projectId: string) => void;
}

/**
 * Project Table Component
 * Table display for project list
 * Following R17: Primary visual element, clear hierarchy
 */
export const ProjectTable = React.memo(function ProjectTable({
  projects,
  onProjectClick,
}: ProjectTableProps) {
  const handleProjectClick = useCallback(
    (projectId: string) => {
      onProjectClick(projectId);
    },
    [onProjectClick]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          <TableCell header>Project Name</TableCell>
          <TableCell header>Status</TableCell>
          <TableCell header>Tasks</TableCell>
          <TableCell header>Created</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <ProjectRow
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </TableBody>
    </Table>
  );
});


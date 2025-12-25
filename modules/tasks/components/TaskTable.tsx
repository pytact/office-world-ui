// Task Table Component
// Feature-specific component - R16 Layer 2
// Composes Table primitives for task list
// Following R17: Primary visual element, clear hierarchy

"use client";

import React, { useCallback } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { TaskRow } from "./TaskRow";
import type { TransformedTaskSummary } from "@/hooks/useTaskTransformations";

interface TaskTableProps {
  tasks: TransformedTaskSummary[];
  onTaskClick: (taskId: string) => void;
}

/**
 * Task Table Component
 * Table display for task list
 * Following R17: Primary visual element, clear hierarchy
 */
export const TaskTable = React.memo(function TaskTable({
  tasks,
  onTaskClick,
}: TaskTableProps) {
  const handleTaskClick = useCallback(
    (taskId: string) => {
      onTaskClick(taskId);
    },
    [onTaskClick]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow hover={false}>
          <TableCell header>Task Name</TableCell>
          <TableCell header>Status</TableCell>
          <TableCell header>Project</TableCell>
          <TableCell header>Permission</TableCell>
          <TableCell header>Last Updated</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TaskRow
            key={task.task_id}
            task={task}
            onClick={handleTaskClick}
          />
        ))}
      </TableBody>
    </Table>
  );
});


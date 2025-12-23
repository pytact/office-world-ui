// UserTable Component
// Feature-specific component - R16 Layer 2
// Composes UI primitives

"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  Badge,
} from "@/components/ui";
import { useAuthContext } from "@/context";
import { userRoutes } from "@/utils/routes";
import { colors, typography } from "@/theme/tokens";
import type { MappedUser } from "@/hooks/useMappedUser";

interface UserTableProps {
  users: MappedUser[];
  showCompany?: boolean;
}

// Memoized style objects to prevent re-renders (R15)
const linkStyle= {
  color: colors.primary,
  textDecoration: "none",
  fontFamily: typography.fontFamily,
};

export const UserTable = React.memo(function UserTable({
  users,
  showCompany = false,
}: UserTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user: currentUser } = useAuthContext();
  const currentUserRole = currentUser?.role?.toLowerCase() || "";
  const isManager = currentUserRole === "manager";

  // Context-aware detail route helper
  const detail = useCallback(
    (userId: string) => {
      if (pathname?.startsWith("/platform")) {
        return userRoutes.platform.detail(userId);
      } else if (pathname?.startsWith("/company")) {
        return userRoutes.company.detail(userId);
      }
      return userRoutes.shared.detail(userId);
    },
    [pathname]
  );

  // Handle row click navigation
  const handleRowClick = useCallback(
    (userId: string) => {
      const url = detail(userId);
      router.push(url);
    },
    [router, detail]
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell header>Email</TableCell>
          <TableCell header>Name</TableCell>
          <TableCell header>Role</TableCell>
          {showCompany && <TableCell header>Company</TableCell>}
          <TableCell header>Status</TableCell>
          <TableCell header>Invitation</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow
            key={user.userId}
            hover={!isManager}
            onClick={!isManager ? () => handleRowClick(user.userId) : undefined}
          >
            <TableCell>
              <Link 
                href={detail(user.userId)} 
                style={linkStyle}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRowClick(user.userId);
                }}
              >
                {user.email}
              </Link>
            </TableCell>
            <TableCell>{user.fullName}</TableCell>
            <TableCell>{user.role}</TableCell>
            {showCompany && <TableCell>{user.companyName || "-"}</TableCell>}
            <TableCell>
              <Badge variant={user.statusBadge.variant}>
                {user.statusBadge.label}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={user.invitationStatusBadge.variant}>
                {user.invitationStatusBadge.label}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});


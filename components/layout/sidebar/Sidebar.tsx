// Sidebar Navigation Component
// Global navigation component following R16 and ui_foundation.config.md
// Role-based dynamic menu with modern UX

"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context";
import { colors, spacing, typography, shadows, borderRadius } from "@/theme/tokens";
import { userRoutes } from "@/utils/routes/user.routes";
import { companyRoutes } from "@/utils/routes/company.routes";
import { employeeRoutes } from "@/utils/routes/employee.routes";
import { salaryRoutes } from "@/utils/routes/salary.routes";
import { notificationRoutes } from "@/utils/routes/notification.routes";
import { projectRoutes } from "@/utils/routes/project.routes";
import { taskRoutes } from "@/utils/routes/task.routes";
import { leaveRoutes } from "@/utils/routes/leave.routes";
import { attendanceRoutes } from "@/utils/routes/attendance.routes";

interface NavItem {
  label: string;
  href: string;
  icon?: string;
  roles: string[];
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, isSuperAdmin } = useAuthContext();

  // Define navigation items based on role
  const navItems: NavItem[] = useMemo(() => {
    const items: NavItem[] = [];

    if (isSuperAdmin || user?.is_super_admin) {
      // SuperAdmin navigation
      items.push(
        { label: "Dashboard", href: "/platform/dashboard", roles: ["superadmin"] },
        { label: "Companies", href: companyRoutes.platform.list, roles: ["superadmin"] },
        { label: "Users", href: userRoutes.platform.list, roles: ["superadmin"] }
      );
    } else {
      // Company user navigation (CEO, HR, Manager, Employee)
      const userRole = user?.role?.toLowerCase() || "";
      
      items.push(
        { label: "Dashboard", href: "/company/dashboard", roles: ["ceo", "hr", "manager", "employee"] }
      );

      // All company users can see Projects (visibility differs by role)
      items.push(
        { label: "Projects", href: projectRoutes.company.list, roles: ["ceo", "hr", "manager", "employee"] }
      );

      // All company users can see Tasks (visibility differs by role)
      items.push(
        { label: "Tasks", href: taskRoutes.company.list, roles: ["ceo", "hr", "manager", "employee"] }
      );

      // All company users can see Leaves (visibility differs by role)
      items.push(
        { label: "Leaves", href: leaveRoutes.company.list, roles: ["ceo", "hr", "manager", "employee"] }
      );

      // All company users can see Attendance (own attendance)
      items.push(
        { label: "Attendance", href: attendanceRoutes.employee.today, roles: ["ceo", "hr", "manager", "employee"] }
      );

      // Manager, HR, CEO can see Company Attendance (oversight)
      if (["ceo", "hr", "manager"].includes(userRole)) {
        items.push(
          { label: "Company Attendance", href: attendanceRoutes.company.list, roles: ["ceo", "hr", "manager"] }
        );
      }

      // Approvers can see Pending Approvals (quick access to approval queue)
      if (["ceo", "hr", "manager"].includes(userRole)) {
        items.push(
          { label: "Pending Approvals", href: leaveRoutes.company.approvals, roles: ["ceo", "hr", "manager"] }
        );
      }

      // CEO and HR can see all company features
      // Show "Employees" (not "Users")
      if (["ceo", "hr"].includes(userRole)) {
        items.push(
          { label: "Employees", href: employeeRoutes.company.list, roles: ["ceo", "hr"] },
          { label: "Company Profile", href: companyRoutes.profile.view, roles: ["ceo", "hr"] }
        );
      }

      // Manager can see employees (limited view)
      if (userRole === "manager") {
        items.push(
          { label: "Employees", href: employeeRoutes.company.list, roles: ["manager"] }
        );
      }

      // All company users can see notifications
      items.push(
        { label: "Notifications", href: notificationRoutes.list, roles: ["ceo", "hr", "manager", "employee"] }
      );
    }

    return items;
  }, [user, isSuperAdmin]);

  // Filter items based on current user role
  const visibleItems = useMemo(() => {
    if (!user) return [];
    const userRole = user.role?.toLowerCase() || "";
    return navItems.filter(item => 
      item.roles.includes(userRole) || 
      (isSuperAdmin && item.roles.includes("superadmin"))
    );
  }, [navItems, user, isSuperAdmin]);

  // Sidebar styles
  const sidebarStyle = useMemo(
    () => ({
      position: "fixed",
      left: 0,
      top: 0,
      width: "260px",
      height: "100vh",
      backgroundColor: colors.backgroundPrimary,
      borderRight: `1px solid ${colors.borderDefault}`,
      boxShadow: shadows.sm,
      padding: `${spacing[6]} ${spacing[4]}`,
      overflowY: "auto",
      zIndex: 50,
    } as const),
    []
  );

  const logoStyle = useMemo(
    () => ({
      fontSize: typography.fontSize.h4,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      marginBottom: spacing[8],
      paddingBottom: spacing[4],
      borderBottom: `1px solid ${colors.borderLight}`,
    } as const),
    []
  );

  const navListStyle = useMemo(
    () => ({
      display: "flex",
      flexDirection: "column",
      gap: spacing[2],
      listStyle: "none",
      margin: 0,
      padding: 0,
    } as const),
    []
  );

  const navItemStyle = useMemo(
    () => (isActive: boolean)=> ({
      display: "block",
      padding: `${spacing[3]} ${spacing[4]}`,
      borderRadius: borderRadius.md,
      fontSize: typography.fontSize.body,
      fontFamily: typography.fontFamily,
      fontWeight: typography.fontWeight.medium,
      color: isActive ? colors.textInverse : colors.textPrimary,
      backgroundColor: isActive ? colors.primary : "transparent",
      textDecoration: "none",
      transition: "background-color 0.2s, color 0.2s",
      cursor: "pointer",
    } as const),
    []
  );

  // Don't show sidebar on login page
  if (pathname === "/login" || pathname?.startsWith("/login")) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <aside style={sidebarStyle}>
      <div style={logoStyle}>officeWorld</div>
      <nav>
        <ul style={navListStyle}>
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link href={item.href} style={navItemStyle(isActive)}>
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}


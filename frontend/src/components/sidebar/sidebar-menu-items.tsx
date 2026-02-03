/**
 * @fileoverview Sidebar Navigation Menu Items Component
 * @module components/sidebar/sidebar-menu-items
 * 
 * @description
 * Client component that renders the main navigation menu items for the
 * dashboard sidebar. Features active state detection based on current
 * route, animated visual indicators, and mobile-responsive behavior.
 * 
 * @requires lucide-react - For navigation icons
 * @requires next/navigation - For usePathname hook
 * @requires ../ui/sidebar - For sidebar menu components and context
 * @requires next/link - For client-side navigation
 * @requires ~/lib/utils - For className utility (cn)
 * 
 * @example
 * // Used within SidebarMenu component
 * <SidebarMenu>
 *   <SidebarMenuItems />
 * </SidebarMenu>
 */
"use client";

import { LayoutDashboard, Wand2, FolderOpen, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import { cn } from "~/lib/utils";
import type { LucideIcon } from "lucide-react";

/**
 * Navigation menu item configuration type.
 * Defines the structure for sidebar navigation entries.
 * 
 * @interface NavItem
 */
interface NavItem {
  /** Display title for the menu item */
  title: string;
  /** Navigation URL path */
  url: string;
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Whether this item is currently active */
  active: boolean;
}

/**
 * Static navigation configuration.
 * Defines all available dashboard navigation routes.
 * 
 * @constant {Omit<NavItem, 'active'>[]}
 */
const NAV_ITEMS: Omit<NavItem, "active">[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create",
    url: "/dashboard/create",
    icon: Wand2,
  },
  {
    title: "Projects",
    url: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

/**
 * SidebarMenuItems - Dashboard navigation menu renderer
 * 
 * Renders navigation links for all dashboard sections with:
 * - Active state detection based on current URL
 * - Animated gradient indicator for active item
 * - Mobile sidebar auto-close on navigation
 * - Smooth color transitions on hover
 * 
 * @component
 * @returns {React.JSX.Element} Fragment containing all menu items
 * 
 * @remarks
 * - Active detection: Exact URL match comparison
 * - Visual feedback: Gradient border indicator on active item
 * - Accessibility: Links maintain proper focus states
 */
export default function SidebarMenuItems(): React.JSX.Element {
  // Get current route for active state determination
  const path = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  // Compute active state for each navigation item
  const items: NavItem[] = NAV_ITEMS.map((item) => ({
    ...item,
    active: path === item.url,
  }));

  /**
   * Handles menu item click events.
   * Closes the mobile sidebar when a navigation item is selected.
   */
  const handleMenuClick = (): void => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={item.active}
            className={cn(
              "group relative h-9 w-full justify-start rounded-sm px-3 py-2 text-sm font-medium transition-all duration-200",
              item.active 
                ? "bg-violet-500/10 text-violet-400" 
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Link
              href={item.url}
              onClick={handleMenuClick}
              className="flex cursor-pointer items-center gap-2.5"
            >
              {/* Navigation icon with active state styling */}
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  item.active
                    ? "text-violet-400"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.title}</span>
              {/* Active indicator - gradient vertical bar */}
              {item.active && (
                <div className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
              )}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
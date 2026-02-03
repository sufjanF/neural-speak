/**
 * @fileoverview Dynamic Breadcrumb Page Title Component
 * @module components/sidebar/breadcrumb-page-client
 * 
 * @description
 * Client-side component that displays the current page title in the breadcrumb
 * navigation. Uses Next.js pathname to dynamically determine the appropriate
 * page title based on the current route.
 * 
 * @requires next/navigation - For usePathname hook
 * @requires ../ui/breadcrumb - For BreadcrumbPage component
 * 
 * @example
 * // Used in dashboard header breadcrumb navigation
 * <Breadcrumb>
 *   <BreadcrumbList>
 *     <BreadcrumbItem>
 *       <BreadcrumbPageClient />
 *     </BreadcrumbItem>
 *   </BreadcrumbList>
 * </Breadcrumb>
 */
"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbPage } from "../ui/breadcrumb";

/**
 * Route-to-title mapping for breadcrumb display.
 * Maps dashboard routes to human-readable page titles.
 * 
 * @constant {Record<string, string>}
 */
const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/create": "Create",
  "/dashboard/projects": "Projects",
  "/dashboard/settings": "Settings",
};

/**
 * BreadcrumbPageClient - Dynamic breadcrumb page title display
 * 
 * Renders the current page title in the breadcrumb based on the active route.
 * Falls back to "Dashboard" for unrecognized routes.
 * 
 * @component
 * @returns {React.JSX.Element} The breadcrumb page title element
 */
export default function BreadcrumbPageClient(): React.JSX.Element {
  // Get current pathname from Next.js navigation
  const path = usePathname();

  /**
   * Resolves the human-readable page title from a route path.
   * 
   * @param {string} path - The current URL pathname
   * @returns {string} The display title for the breadcrumb
   */
  const getPageTitle = (path: string): string => {
    return ROUTE_TITLES[path] ?? "Dashboard";
  };

  return (
    <BreadcrumbPage className="text-foreground text-sm font-medium">
      {getPageTitle(path)}
    </BreadcrumbPage>
  );
}
/**
 * @fileoverview Mobile Sidebar Close Button Component
 * @module components/sidebar/mobile-sidebar-close
 * 
 * @description
 * Client component that renders a close button for the mobile sidebar.
 * Only visible on mobile viewports, providing users a way to dismiss
 * the sidebar overlay. Uses the sidebar context for state management.
 * 
 * @requires lucide-react - For X (close) icon
 * @requires ../ui/sidebar - For useSidebar context hook
 * @requires ../ui/button - For Button component
 * 
 * @example
 * // Used within the Sidebar component
 * <Sidebar>
 *   <SidebarContent>
 *     <MobileSidebarClose />
 *     ...navigation items...
 *   </SidebarContent>
 * </Sidebar>
 */
"use client";

import { X } from "lucide-react";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";

/**
 * MobileSidebarClose - Responsive sidebar dismiss button
 * 
 * Renders a close button in the top-right corner of the mobile sidebar.
 * Conditionally renders based on viewport - returns null on desktop.
 * Provides accessible close functionality with proper ARIA labeling.
 * 
 * @component
 * @returns {React.JSX.Element | null} Close button on mobile, null on desktop
 * 
 * @remarks
 * - Responsive: Only renders on mobile viewports
 * - Accessibility: Includes aria-label for screen readers
 * - Positioning: Absolutely positioned in top-right corner
 */
export default function MobileSidebarClose(): React.JSX.Element | null {
  // Access sidebar state and controls from context
  const { setOpenMobile, isMobile } = useSidebar();

  // Early return on desktop - close button not needed
  if (!isMobile) return null;

  return (
    <div className="absolute top-2 right-2 z-50 mb-4 px-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenMobile(false)}
        className="hover:bg-muted/50 h-8 w-8 p-0"
        aria-label="Close sidebar"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
/**
 * Dashboard Layout Component
 * ===========================
 * 
 * The primary layout for all authenticated dashboard pages. This layout
 * provides the sidebar navigation, header with breadcrumbs, and main
 * content area for the application's core functionality.
 * 
 * @module app/(dashboard)/dashboard/layout
 * 
 * Architecture:
 * - Uses shadcn/ui Sidebar components for collapsible navigation
 * - Implements sticky header with glassmorphism effect
 * - Provides dynamic breadcrumb navigation
 * - Wraps content with authentication and theme providers
 * 
 * Layout Structure:
 * ┌─────────────────────────────────────────────────┐
 * │ ┌─────────┐ ┌─────────────────────────────────┐ │
 * │ │         │ │ Header (Sticky)                 │ │
 * │ │ Sidebar │ ├─────────────────────────────────┤ │
 * │ │         │ │                                 │ │
 * │ │         │ │ Main Content Area               │ │
 * │ │         │ │ (Scrollable)                    │ │
 * │ │         │ │                                 │ │
 * │ └─────────┘ └─────────────────────────────────┘ │
 * └─────────────────────────────────────────────────┘
 * 
 * @see {@link AppSidebar} - Sidebar navigation component
 * @see {@link BreadcrumbPageClient} - Dynamic breadcrumb component
 */

import "~/styles/globals.css";
import { Providers } from "~/components/providers";
import { Toaster } from "~/components/ui/sonner";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
} from "~/components/ui/breadcrumb";
import { type Metadata } from "next";
import BreadcrumbPageClient from '~/components/sidebar/breadcrumb-page-client';
import AppSidebar from '~/components/sidebar/app-sidebar';

// =============================================================================
// SEO METADATA
// =============================================================================

/**
 * Dashboard-specific metadata for SEO and browser display.
 */
export const metadata: Metadata = {
  title: "Neural Speak",
  description: "A platform for AI-powered speech synthesis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

// =============================================================================
// LAYOUT COMPONENT
// =============================================================================

/**
 * DashboardLayout - Layout wrapper for all dashboard pages.
 * 
 * This layout provides:
 * - Collapsible sidebar navigation via SidebarProvider
 * - Sticky header with sidebar toggle and breadcrumb navigation
 * - Scrollable main content area
 * - Toast notification system
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child page content
 * @returns {JSX.Element} The dashboard layout structure
 */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <SidebarProvider>
        {/* Primary navigation sidebar */}
        <AppSidebar />
        
        {/* Main content area adjacent to sidebar */}
        <SidebarInset className="flex h-screen flex-col">
          {/* Sticky header with glassmorphism effect */}
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-xl">
            <div className="flex shrink-0 grow items-center gap-3">
              {/* Sidebar toggle button */}
              <SidebarTrigger className="-ml-1 h-8 w-8 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
              
              {/* Visual separator */}
              <Separator
                orientation="vertical"
                className="mr-2 h-6 bg-border/50 data-[orientation=vertical]:h-6"
              />
              
              {/* Breadcrumb navigation */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPageClient />
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          
          {/* Scrollable main content area */}
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      
      {/* Toast notification system */}
      <Toaster />
    </Providers>
  );
}
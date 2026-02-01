/**
 * App Sidebar Component
 * ---------------------
 * Main navigation sidebar for the dashboard.
 * Server component that renders the sidebar layout with navigation,
 * user controls, and credit display.
 */
"use server";

import { UserButton } from "@daveyplate/better-auth-ui";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import { User, Settings } from "lucide-react";
import Link from "next/link";
import SidebarMenuItems from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import Upgrade from "./upgrade";
import { Logo } from "../ui/logo";

/**
 * AppSidebar - Primary dashboard navigation
 * Displays logo, navigation links, credits, and user menu.
 */
export default async function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/20 bg-sidebar">
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          {/* Brand header with logo */}
          <SidebarGroupLabel className="mb-6 mt-5 flex flex-col items-start justify-start px-2">
            <Link
              href="/"
              className="mb-1 flex cursor-pointer items-center gap-2.5 group"
            >
              <Logo size="md" showText textClass="text-lg font-semibold tracking-tight text-foreground" />
            </Link>
          </SidebarGroupLabel>
          {/* Navigation menu items */}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {/* Footer with credits, upgrade button, and user menu */}
      <SidebarFooter className="border-t border-border/20 bg-muted/5 p-3">
        <div className="mb-2 flex w-full items-center justify-center gap-2 text-xs">
          <Credits />
          <Upgrade />
        </div>
        <UserButton
          variant="outline"
          className="w-full border-border/30 bg-card/50 transition-all duration-200 hover:border-violet-500/30 hover:bg-accent"
          disableDefaultLinks={true}
          additionalLinks={[
            {
              label: "Customer Portal",
              href: "/dashboard/customer-portal",
              icon: <User className="h-4 w-4" />,
            },
            {
              label: "Settings",
              href: "/dashboard/settings",
              icon: <Settings className="h-4 w-4" />,
            },
          ]}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
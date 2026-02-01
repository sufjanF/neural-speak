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
import { User, AudioWaveform, Settings } from "lucide-react";
import Link from "next/link";
import SidebarMenuItems from "./sidebar-menu-items";
import MobileSidebarClose from "./mobile-sidebar-close";
import Credits from "./credits";
import Upgrade from "./upgrade";

export default async function AppSidebar() {
  return (
    <Sidebar className="border-r border-border/20 bg-sidebar">
      <SidebarContent className="px-3">
        <MobileSidebarClose />
        <SidebarGroup>
          <SidebarGroupLabel className="mb-6 mt-5 flex flex-col items-start justify-start px-2">
            <Link
              href="/"
              className="mb-1 flex cursor-pointer items-center gap-2 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-sm gradient-shift shadow-lg transition-transform duration-300 group-hover:scale-105">
                <AudioWaveform className="h-4 w-4 text-white" />
              </div>
              <p className="text-lg font-semibold tracking-tight text-foreground">
                Neural Speak
              </p>
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              <SidebarMenuItems />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border/20 bg-muted/5 p-3">
        <div className="mb-2 flex w-full items-center justify-center gap-2 text-xs">
          <Credits />
          <Upgrade />
        </div>
        <UserButton
          variant="outline"
          className="w-full border-border/30 bg-card/50 transition-all duration-200 hover:border-cyan-500/30 hover:bg-accent"
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
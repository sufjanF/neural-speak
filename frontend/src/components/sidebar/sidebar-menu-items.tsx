"use client";

import { LayoutDashboard, Wand2, FolderOpen, Settings } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function SidebarMenuItems() {
  const path = usePathname();
  const { setOpenMobile, isMobile } = useSidebar();

  let items = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      active: false,
    },
    {
      title: "Create",
      url: "/dashboard/create",
      icon: Wand2,
      active: false,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: FolderOpen,
      active: false,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      active: false,
    },
  ];

  items = items.map((item) => ({
    ...item,
    active: path === item.url,
  }));

  const handleMenuClick = () => {
    // Close mobile sidebar when clicking a menu item
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
              <item.icon
                className={cn(
                  "h-4 w-4 transition-colors duration-200",
                  item.active
                    ? "text-violet-400"
                    : "text-muted-foreground group-hover:text-foreground",
                )}
              />
              <span className="truncate">{item.title}</span>
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
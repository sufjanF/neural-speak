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

export const metadata: Metadata = {
  title: "Neural Speak",
  description: "A platform for AI-powered speech synthesis",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex h-screen flex-col">
          <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 px-6 py-3 backdrop-blur-xl">
            <div className="flex shrink-0 grow items-center gap-3">
              <SidebarTrigger className="-ml-1 h-8 w-8 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" />
              <Separator
                orientation="vertical"
                className="mr-2 h-6 bg-border/50 data-[orientation=vertical]:h-6"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPageClient />
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto bg-background p-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <Toaster />
    </Providers>
  );
}